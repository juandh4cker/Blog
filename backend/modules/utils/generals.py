from bcrypt import checkpw, gensalt, hashpw
from datetime import datetime, timezone
from re import compile, match, Pattern
from requests import get, Response
from typing import List

def creation_date() -> str:
    """Devuelve la fecha de creación actual."""
    return datetime.now(timezone.utc).isoformat(timespec="milliseconds")

def check_password(to_check: str, hashed: str) -> bool:
    """Compara las contraseñas
    
    Args:
        to_check (str): Contraseña a validar.
        hashed (str): Contraseña hasheada.

    Returns:
        bool: True si es válida, False de lo contrario.
    """
    return checkpw(to_check.encode("utf-8"), hashed.encode("utf-8"))

def encode_password(password: str) -> str:
    """
    Codifica una contraseña con bcrypt.

    Args:
        password (str): Contraseña la cual se desea codificar.

    Returns:
        str: Contraseña codificada.
    """
    try:
        return hashpw(password.encode("utf-8"), gensalt(10)).decode("utf-8")

    except Exception as e:
        raise RuntimeError(f"Error al codificar la contraseña: {e}") from e

def is_valid_username(username: str) -> bool:
    """
    Valida el formato del nombre de usuario.

    Args:
        username (str): Nombre de usuario a validar.

    Returns:
        bool: True si el nombre de usuario es válido, False de lo contrario.
    """
    pattern: str = r"^[a-zA-Z0-9._]+[a-zA-Z0-9_]$"
    return bool(match(pattern, username))

def is_valid_email(email: str) -> bool:
    """
    Valida el formato del correo electrónico.

    Args:
        email (str): Correo electrónico a validar.

    Returns:
        bool: True si el correo electrónico es válido, False de lo contrario.
    """
    pattern: str = r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
    return bool(match(pattern, email))

def is_valid_password(password: str) -> bool:
    """
    Valida que la contraseña tenga al menos 8 caracteres, incluyendo mayúsculas,
    minúsculas y dígitos.

    Args:
        password (str): Contraseña a validar.

    Returns:
        bool: True si la contraseña es válida, False de lo contrario.
    """
    pattern: str = r"^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$"
    return bool(match(pattern, password))

def is_valid_image(url: str) -> bool:
    """
    Verifica si una URL es válida y apunta a una imagen real.

    Args:
        url (str): URL a verificar.

    Returns:
        bool: True si la URL es válida y contiene una imagen, False en caso contrario.
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