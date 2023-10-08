import React from 'react';
import './Nav.css';

export const Nav = ({ state, send }) => {
  const goToWelcome = () => {
    send('CANCEL')
  }
  return (
    <nav className='Nav'>
      <h1 className='Nav-logo'>Book a fly ✈</h1>
        {
          !state.matches('initial') && !state.matches('tickets') &&
          <button 
            className='Nav-cancel button-secondary'
            onClick={goToWelcome}
          >Cancelar</button>
          
        }
    </nav>
  );
}; 