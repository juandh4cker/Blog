import { User as HeroUser } from "@heroui/react";
import { useNav } from '@/hooks';

const UserCard = ({ user, description, descriptionClassName, ...props}) => {
  const { navUser } = useNav();

  return (
    <div onClick={() => navUser(user)}>
      <HeroUser
        classNames={{
          description: descriptionClassName || 'text-[0.6rem]',
          base: 'hover:bg-primary/20 cursor-pointer p-1',
          wrapper: 'items-center p-1'
        }}
        avatarProps={{
          src: "https://www.svgrepo.com/show/452030/avatar-default.svg",
        }}
        description={description}
        name={user}
        {...props}
      />
    </div>
  )
};

export default UserCard;