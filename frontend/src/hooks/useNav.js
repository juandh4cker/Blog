import { useNavigate, useLocation } from 'react-router-dom';

export const useNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return {
    navigate,
    nav: (route) => navigate(route),
    navBack: () => navigate(-1),
    navBackSteps: (steps = 1) => navigate(-steps),
    navBlog: () => navigate('/blog'),
    navDashboard: () => navigate('/dashboard'),
    navLogout: () => navigate('/welcome', { replace: true }),
    navUser: (user) => navigate(`/user/${user}`),
    navPost: (postID, edit=false) => navigate(`/post/${postID}${edit ? '/edit' : ''}`),
    navWelcome: () => navigate('/welcome', { replace: true, state: { from: location.pathname } })
  };
};
 