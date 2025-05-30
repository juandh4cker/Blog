import { useNav } from '../../hooks/useNav';

const LoginButton = () => {
  const { navWelcome } = useNav();

  return (
    <button
      onClick={navWelcome}
      className="fixed top-5 right-5 z-[1000] px-5 py-2 bg-blue-500 text-white rounded-[10px] text-base transition-transform duration-200 hover:scale-[1.02]"
      aria-label="Iniciar sesión"
    >
      {'Iniciar sesión'}
    </button>
  );
};

export default LoginButton;
