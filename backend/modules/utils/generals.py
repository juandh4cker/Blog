from bcrypt import checkpw, gensalt, hashpw
from datetime import datetime, timezone
from re import compile, match, Pattern
from requests import get, Response
from typing import Any, Dict, List, Optional
import inspect, json

def creation_date() -> str:
    """
    Give the actual date.

    Returns:
        str: Actual date in format ISO 8601.
    """    
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")

def check_password(to_check: str, hashed: str) -> bool:
    """
    Check a string password with the hashed password.

    Args:
        to_check (str): The string password.
        hashed (str): The hashed password.

    Returns:
        bool: True if is checked, else False.
    """
    return checkpw(to_check.encode("utf-8"), hashed.encode("utf-8"))

def encode_password(password: str) -> str:
    """
    Encode a password.

    Args:
        password (str): The password to encode.

    Returns:
        str: The encoded password.
    """    
    return hashpw(password.encode("utf-8"), gensalt(10)).decode("utf-8")

def logify(exclude: Optional[list] = None) -> str:
    """
    Make a log with the function´s args excluding someones.

    Args:
        exclude (Optional[list], optional): Args to exculde. Defaults to None.

    Returns:
        str: Formatted log.
    """    
    exclude = exclude or []
    frame = inspect.currentframe().f_back
    args: Dict[str, Any] = {k: v for k, v in frame.f_locals.items() if k not in exclude}
    return json.dumps(args, default=str)

def is_valid_username(username: str) -> bool:
    """
    Check if is a valid username.

    Conditions:
    - It can have letters (upper or lowercase), numbers, dots and underscores.
    - It can't end with a dot.

    Args:
        username (str): Username to validate.

    Returns:
        bool: True if is valid, else False.
    """    
    #minimo 3, maximo 12 caracteres
    pattern: str = r"^[a-zA-Z0-9._]+[a-zA-Z0-9_]$"
    return bool(match(pattern, username))

def is_valid_email(email: str) -> bool:
    """
    Check if is a valid email.

    Conditions:
    - An standart email direction (example@email.com)

    Args:
        email (str): Email to validate.

    Returns:
        bool: True if is valid, else False.
    """    
    pattern: str = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(match(pattern, email))

def is_valid_password(password: str) -> bool:
    """
    Check if is a valid password.

    Conditions:
    - Almost 8 characters.
    - Almost one uppercase.
    - Almost one lowecase.
    - Almost one number.

    Args:
        password (str): Password to validate.

    Returns:
        bool: True if is valid, else False.
    """    
    pattern: str = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
    return bool(match(pattern, password))

def is_valid_image(url: str) -> bool:
    """
    Check if is a valid image url.

    Conditions:
    - It can be with or without 'http://' or 'https://'
    - Valid domain and optional route.
    - It can be a JPEG, PNG or GIF.

    Args:
        url (str): Url with image to validate.

    Returns:
        bool: True if is valid, else False.
    """    
    url_regex: Pattern[str] = compile(
        r"^(https?://)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)$"
    )

    if not url_regex.fullmatch(url):
        return False

    if not url.startswith(("http://", "https://")):
        url = "https://" + url

    try:
        response: Response = get(url, stream=True, timeout=5, headers={"User-Agent": "Mozilla/5.0"})
        
        if response.status_code != 200:
            return False

        content_type = response.headers.get("Content-Type", "")
        if content_type.startswith("image/"):
            return True

        first_bytes: bytes = response.raw.read(10)
        image_signatures: List[bytes] = [b"\xff\xd8", b"\x89PNG", b"GIF87a", b"GIF89a"]  # JPEG, PNG, GIF
        return any(first_bytes.startswith(sig) for sig in image_signatures)

    except Exception:
        return False