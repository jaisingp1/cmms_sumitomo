import React from 'react';

interface ProfileCardProps {
  userName: string;
  userRole: string;
  profileImageUrl?: string;
  onProfileClick: () => void;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userName, userRole, profileImageUrl, onProfileClick }) => {
  return (
    <div className="flex items-center space-x-3 cursor-pointer" onClick={onProfileClick}>
      <div>
        <p className="font-semibold text-sm">{userName}</p>
        <p className="text-xs text-gray-400">{userRole}</p>
      </div>
      <img
        className="h-10 w-10 rounded-full object-cover"
        src={profileImageUrl || `https://via.placeholder.com/150/0000FF/808080?Text=User`}
        alt="User profile"
      />
    </div>
  );
};

export default ProfileCard;
