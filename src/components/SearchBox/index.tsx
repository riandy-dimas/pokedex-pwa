import React from 'react';
import './styles.css';
import Button from '../Button';

type TSearchBox = {
  value: string
  onReset: () => void
  placeholder: string
}
const SearchBox = ({
  value,
  onReset,
  placeholder,
}: TSearchBox) => {
  return <div className='search-box'>
    <form className='search-box__form' action="">
      <input autoComplete='false' placeholder={placeholder} className='search-box__input-field' defaultValue={value} type="search" name="pokemon" id="pokemon" />
      <Button className='search-box__submit-button' type="submit">Search</Button>
      <Button className='search-box__reset-button' onClick={() => onReset()} type="reset">⟳</Button>
    </form>
  </div>;
};

export default SearchBox;
