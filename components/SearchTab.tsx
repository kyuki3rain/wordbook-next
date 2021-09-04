import React, { useState } from 'react';
import styled from '@emotion/styled';
import { NextPage } from 'next';
import { Transition } from 'react-transition-group';
import {  RowContainer } from '../components/common/Container';

const Button = styled.div({
  borderRadius: 10,
  backgroundColor: '#564c46',
  fontSize: 20, color: 'white',
  paddingLeft: '3vw', paddingRight: '3vw', paddingTop: '1vh', paddingBottom: '1vh',
  ':active': {
    backgroundColor: 'black'
  },
  textAlign: 'center'
})

type FloatProps = {
  top?: string
  right?: string
  bottom?: string
  left?: string
}

const Float = styled.div<FloatProps>`
  margin: 0;
  top: ${(props) => props.top || 'auto'};
  right: ${(props) => props.right || 'auto'};
  bottom: ${(props) => props.bottom || 'auto'};
  left: ${(props) => props.left || 'auto'};
  position: fixed;
`

type Props = {
    search: () => void,
    mount: boolean,
    handleInputChange: (e: any) => void,
    word: string
}

const SearchTab: NextPage<Props> = ({search, mount, handleInputChange, word}) => {
  return (
    <Float top={"0"} left={"0"}>
    <Transition in={mount} timeout={500}>
      {(state) => 
        <RowContainer style={{width: '100vw', height: state == "entering" || state == "entered" ? '10vh': "100vh", backgroundColor: '#FFB830', transition: 'all 1s ease', zIndex: 20000}}>
          <input
            type="text"
            name="word"
            defaultValue={word}
            onChange={handleInputChange}
            style={{marginRight: 10, fontSize: 24, width: '70vw', maxWidth: 400}}
          ></input>
          <Button
            onClick={() => {
                search();
            }}>
            検索
          </Button>
        </RowContainer>
      }
    </Transition>
  </Float>
  );
}

export default SearchTab;
