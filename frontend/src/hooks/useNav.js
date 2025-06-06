import { useNavigate, useLocation } from 'react-router-dom';

export const useNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  const from = location.state?.from;

  return {
    pathname,
    from,
    nav: (route) => navigate(route),
    navBack: () => navigate(-1),
    navBackSteps: (steps = 1) => navigate(-steps),
    navBlog: () => navigate('/'),
    navDashboard: () => navigate('/dashboard'),
    navLogout: () => navigate('/welcome', { replace: true }),
    navUser: (user) => navigate(`/user/${user}`),
    navPost: (postID, edit=false) => navigate(`/post/${postID}${edit ? '/edit' : ''}`),
    navWelcome: () => navigate('/welcome', { replace: true, state: { from: location.pathname } }),
    navRegister: () => navigate('/welcome/register', { replace: true, state: { from: pathname } }),
    navFrom: (alternative = () => navigate('/')) => from ? navigate(from) : alternative()
  };
};
 