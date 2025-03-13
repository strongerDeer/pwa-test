import { useSendbird } from "@sendbird/uikit-react";

const DEFAULT_USER_PROFILE_URL = "https://via.placeholder.com/80"; // Fallback image URL
const DEFAULT_USER_NAME = "No Name";

export const UserProfile = () => {
  const {
    state: { store },
  } = useSendbird();
  const { userStore } = store.stores;
  const { user } = userStore;

  return (
    <div className="sendbird__user-profile">
      <section className="sendbird__user-profile-avatar">
        <img
          height="80px"
          width="80px"
          src={user?.profileUrl ?? DEFAULT_USER_PROFILE_URL}
          alt={user.nickname ? `${user.nickname}'s avatar` : "Default avatar"}
        />
      </section>
      <section className="sendbird__user-profile-name">
        <span>{user?.nickname || DEFAULT_USER_NAME}</span>
      </section>
    </div>
  );
};
