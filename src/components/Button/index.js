import styled from 'styled-components';

const Button = styled.button({
  width: '100%',
  padding: '0.5rem',
  marginBottom: '1rem',
  backgroundColor: props => props.type === 'danger' ? 'firebrick' : 'var(--color-killarney)',
  border: 'none',
  borderRadius: '0.2rem',
  fontSize: '0.8rem',
  color: 'var(--color-aths-special)',
  textTransform: 'uppercase',
  transition: '0.5s ease all',
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: props => props.type === 'danger' ? 'red' : 'var(--color-keppel)',
    color: 'white'
  },
  '&:focus': {
    backgroundColor: props => props.type === 'danger' ? 'red' : 'var(--color-keppel)',
    color: 'white'
  },
  '&:disabled': {
    backgroundColor: 'var(--color-keppel)',
    cursor: 'default'
  }
});

export default Button;