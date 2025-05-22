import { useNavigate } from 'react-router-dom';

export const useNav = () => {
  const navigate = useNavigate();

  return {
    navigateBack: (steps = 1) => navigate(-steps),
    navigateBlog: () => navigate('/blog'),
    navigateDashboard: () => navigate('/dashboard'),
    navigateLogout: () => navigate('/logout'),
    navigateUser: (user) => navigate(`/user/${user}`),
    navigatePost: (postID, edit=false) => navigate(`/post/${postID}${edit ? '/edit' : ''}`)
  };
};
