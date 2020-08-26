import styled from 'styled-components';

const Backdrop = styled.div({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  top: '0',
  bottom: '0',
  right: '0',
  left: '0',
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  zIndex: '999'
});

export default Backdrop;