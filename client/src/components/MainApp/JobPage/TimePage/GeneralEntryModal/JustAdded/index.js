import React from 'react';
import getStyle from './style';

function JustAdded({
  justAdded,
  toggleDeleteSegmentModal
}) {

  const style = getStyle();

  return (true || (justAdded && justAdded.length > 0)) ? (
    <>
      {/* <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            Just Added
          </p>
          <a href="#" className="card-header-icon" aria-label="more options">
            <span className="icon">
              <i className="fas fa-angle-down" aria-hidden="true"></i>
            </span>
          </a>
        </header>
        <div className="card-content">
          <div className="content">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus nec iaculis mauris.
            <a href="#">@bulmaio</a>. <a href="#">#css</a> <a href="#">#responsive</a>
            <br />
            <time datetime="2016-1-1">11:09 PM - 1 Jan 2016</time>
          </div>
        </div>
        <footer className="card-footer">
          <a href="#" className="card-footer-item">Save</a>
          <a href="#" className="card-footer-item">Edit</a>
          <a href="#" className="card-footer-item">Delete</a>
        </footer>
      </div> */}
      <article className="message" style={style.message}>
        <div className="message-body">

        </div>
      </article>
      <hr style={style.bottomHr} />
    </>
  ) : (
    <></>
  );
}

export default JustAdded;
