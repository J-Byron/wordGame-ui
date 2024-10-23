const PlayerIcon = ({ iconId, color }) => {
  const height = 20;
  const width = 20;
  switch (iconId) {
    // Square
    case 1:
      return (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width={width} height={height} rx="2" fill={`#${color}`} />
        </svg>
      );

    // Circle
    case 2:
      return (
        <svg
          width={width}
          height={height}
          viewBox={`0 0 ${width} ${height}`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect width={width} height={height} rx="29" fill={`#${color}`} />
        </svg>
      );

    // Triangle
    case 3:
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 63 55"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M28.9019 1.5C30.0566 -0.499998 32.9434 -0.5 34.0981 1.5L62.2439 50.25C63.3986 52.25 61.9552 54.75 59.6458 54.75H3.35418C1.04478 54.75 -0.398601 52.25 0.7561 50.25L28.9019 1.5Z"
            fill={`#${color}`}
          />
        </svg>
      );

    // Star
    case 4:
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 61 59"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M27.6468 2.78116C28.5449 0.0172279 32.4551 0.0172176 33.3532 2.78115L38.4702 18.5299C38.8719 19.766 40.0237 20.6028 41.3234 20.6028L57.8826 20.6028C60.7888 20.6028 61.9971 24.3217 59.646 26.0299L46.2493 35.7632C45.1978 36.5271 44.7579 37.8812 45.1595 39.1173L50.2766 54.866C51.1746 57.6299 48.0112 59.9283 45.66 58.2201L32.2634 48.4868C31.2119 47.7229 29.7881 47.7229 28.7366 48.4868L15.34 58.2201C12.9888 59.9283 9.82538 57.6299 10.7234 54.866L15.8405 39.1173C16.2421 37.8812 15.8022 36.5271 14.7507 35.7632L1.35403 26.0299C-0.997115 24.3217 0.211203 20.6028 3.11737 20.6028L19.6766 20.6028C20.9763 20.6028 22.1281 19.766 22.5298 18.5299L27.6468 2.78116Z"
            fill={`#${color}`}
          />
        </svg>
      );

    case 5:
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 61 59"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M27.6468 2.78116C28.5449 0.0172279 32.4551 0.0172176 33.3532 2.78115L38.4702 18.5299C38.8719 19.766 40.0237 20.6028 41.3234 20.6028L57.8826 20.6028C60.7888 20.6028 61.9971 24.3217 59.646 26.0299L46.2493 35.7632C45.1978 36.5271 44.7579 37.8812 45.1595 39.1173L50.2766 54.866C51.1746 57.6299 48.0112 59.9283 45.66 58.2201L32.2634 48.4868C31.2119 47.7229 29.7881 47.7229 28.7366 48.4868L15.34 58.2201C12.9888 59.9283 9.82538 57.6299 10.7234 54.866L15.8405 39.1173C16.2421 37.8812 15.8022 36.5271 14.7507 35.7632L1.35403 26.0299C-0.997115 24.3217 0.211203 20.6028 3.11737 20.6028L19.6766 20.6028C20.9763 20.6028 22.1281 19.766 22.5298 18.5299L27.6468 2.78116Z"
            fill="green"
          />
        </svg>
      );

    default:
      return (
        <svg
          width={width}
          height={height}
          viewBox="0 0 77 77"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect
            y="42.5464"
            width="54.7471"
            height="54.7471"
            rx="27.3736"
            transform="rotate(-51 0 42.5464)"
            fill="#B3B3B3"
          />
          <path
            d="M18.4912 64.6091L59.1249 12.6004"
            stroke="#FF4F79"
            stroke-width="10"
            stroke-linecap="round"
          />
        </svg>
      );
  }
};

export default PlayerIcon;
