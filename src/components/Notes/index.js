import React, { useState, useEffect } from 'react';
import Backdrop from '../Backdrop';
import Button from '../Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './index.css';

const Notes = (props) => {
  const [notes, setNotes] = useState(null);

  useEffect(() => {
    if (props.currentResId && props.passport && props.passport.restaurants) {
      const resIndex = props.passport.restaurants.findIndex(res => res.id === props.currentResId);
      if (resIndex > -1) {
        setNotes(props.passport.restaurants[resIndex].notes);
      }
    }
    props.setLoading(false);
  }, [props.passport, props.currentResId]);

  return props.isModalOpen && (
    <Backdrop
      onClick={props.onCloseModal}>
      <div
        className="notes"
        onClick={e => e.stopPropagation()}>
        <button
          className="close-button"
          onClick={props.onCloseModal}>
          <FontAwesomeIcon icon={faTimes} color="black" />
        </button>
        <h2>Notes</h2>
        <form>
          <label htmlFor="note-text">Enter restaurant notes</label>
          <textarea
            placeholder="Two thumbs up!"
            value={props.notesInput || ''}
            onChange={props.onChangeNotes}
            id="note-text"
            rows="10" />
          <Button
            onClick={props.onAddNote}
            disabled={!props.notesInput}>Add Note</Button>
        </form>
        {notes && notes.map(item => (
          <ul
            key={item.key}
            className="note">
            <li className="delete">
              <button
                onClick={() => props.onDeleteNote(item.key)}>
                <i className="fas fa-trash-alt" />
              </button>
            </li>
            <li
              key="date"
              className="date">{item.date}</li>
            <li
              key="note"
              className="text">{item.text}</li>
          </ul>
        ))}
      </div>
    </Backdrop>
  );
}

export default Notes;