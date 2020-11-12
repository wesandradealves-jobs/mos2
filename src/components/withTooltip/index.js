import React from 'react';

const ComponentWithTooltip = ({ children, className, title, styles }) => {
  return (
    <div className={className}>
      {children}
      <span style={styles.span}>{title}</span>
    </div>
  );
};

export default ComponentWithTooltip;
