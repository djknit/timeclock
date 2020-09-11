import React from 'react';
import getStyle from './style';
import Button from '../../../Button';

function WelcomeAndLogout({
  profileData,
  isLoading,
  isLoggedIn,
  submitLogout,
  areAnyModalsOpen,
  hasProblem
}) {

  const style = getStyle();

  return (
    <div className="navbar-item" style={style.navItem}>
      <span style={style.welcomeText}>
        {profileData && isLoggedIn ? (
          <>Hi, <strong style={style.userName}>{profileData.username || profileData.email}</strong>!</>
        ) : (
          <>No user found.</>
        )}
        {hasProblem &&
          <>Unexpected outcome.</>
        }
      </span>
      {isLoggedIn &&
        <Button
          size="none"
          onClick={submitLogout}
          isLoading={isLoading}
          styles={style.logoutButton}
          allowTabFocus={!areAnyModalsOpen}
        >
          Sign Out
        </Button>
      }
    </div>
  );
}

export default WelcomeAndLogout;