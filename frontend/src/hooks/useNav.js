import { useNavigate, useLocation } from 'react-router-dom';

export const useNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const from = location.state?.from;

  const currentUrl = window.location.origin + location.pathname + location.search + location.hash;

  const navFrom = (alternative) => {
    if (from) {
      navigate(from);
      return;
    }

    if (alternative) {
      if (typeof alternative === 'function') {
        alternative();
      } else {
        navigate(alternative);
      }
    } else {
      navigate('/');
    }
  };

  return {
    pathname,
    from,
    currentUrl,
    nav: (route) => navigate(route),

    navBack: () => navigate(-1),
    navBackSteps: (steps = 1) => navigate(-steps),

    navWelcome: () => navigate('/welcome', { replace: true }),
    navRegister: () => navigate('/welcome/register', { replace: true }),

    navBlog: () => navigate('/'),
    navDashboard: () => navigate('/dashboard'),
    navUser: (user) => navigate(`/user/${user}`),
    navPost: (postID, edit = false) => navigate(`/post/${postID}${edit ? '/edit' : ''}`),
    navConfig: () => navigate('/config'),

    navFrom,
  };
};
