import { User as HeroUser, Avatar as HeroAvatar } from '@heroui/react';
import { useNav } from '@/hooks';

import KindsManager from '../KindsManager';

const baseProps = {};

const kingdoms = {
  default: {
    component: (props) => <HeroUser {...props}>{props.children}</HeroUser>,
    kingdomProps: {},
  },
  user: {
    component: (props) => <BaseUser {...props}>{props.children}</BaseUser>,
    kingdomProps: {
      classNames: {
        base: 'hover:bg-primary/20 cursor-pointer p-1',
        wrapper: 'items-center p-1',
      },
    },
  },
  avatar: {
    component: (props) => <HeroAvatar {...props}>{props.children}</HeroAvatar>,
    kingdomProps: {
      isBordered: true,
      showFallback: true,
      src: 'https://www.svgrepo.com/show/452030/avatar-default.svg',
    },
  },
};

const kinds = {
  default: {
    kingdom: 'default',
    props: {},
  },
  user: {
    kingdom: 'user',
    props: {
      descriptionClassName: 'text-[0.6rem]',
    },
  },
  comment: {
    kingdom: 'user',
    props: {
      descriptionClassName: 'text-yellow-300',
    },
  },
  avatar: {
    kingdom: 'avatar',
    props: {},
  },
  bigAvatar: {
    kingdom: 'avatar',
    props: {
      className: 'w-26 h-26 text-large',
    },
  },
};

const defaultKind = 'user';

const BaseUser = ({ src, user, avatarProps, classNames, descriptionClassName, ...props }) => {
  const { navUser } = useNav();

  return (
    <div onClick={() => navUser(user)}>
      <HeroUser
        classNames={{
          description: descriptionClassName,
          ...classNames,
        }}
        avatarProps={{
          src: src,
          ...avatarProps,
        }}
        {...props}
      />
    </div>
  );
};

const UserCard = ({ kind, children, ...props }) => {
  const allProps = {
    ...props,
  };

  return (
    <KindsManager
      baseProps={baseProps}
      kingdoms={kingdoms}
      kinds={kinds}
      kind={kind}
      defaultKind={defaultKind}
      {...allProps}
    >
      {children}
    </KindsManager>
  );
};

export default UserCard;
