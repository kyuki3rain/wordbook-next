import React, { useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { NextPage } from 'next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading';
import WordList from '../components/MainView/WordList';
import ResultList from '../components/MainView/ResultList';
import { ColumnContainer } from '../components/common/Container';
import SearchTab from '../components/SearchTab';
import { addMeanings, searchWord } from '../db/helpers';

const Body = styled(ColumnContainer)({
  height: '100vh',
  width: '100vw',
  backgroundColor: '#FFEDDA'
})

const MainView = styled.div({
  width: '100vw',
  height: '90vh',
  marginTop: '10vh'
})

type Props = {
  top?: string
  right?: string
  bottom?: string
  left?: string
}

const Float = styled.div<Props>`
  margin: 0;
  top: ${(props) => props.top || 'auto'};
  right: ${(props) => props.right || 'auto'};
  bottom: ${(props) => props.bottom || 'auto'};
  left: ${(props) => props.left || 'auto'};
  position: fixed;
`

const ListButton = styled.div`
  display: inline-block;
  text-decoration: none;
  background: #3DB2FF;
  color: #fff;
  width: 20vw;
  height: 20vw;
  border-radius: 50%;
  text-align: center;
  overflow: hidden;
  box-shadow: 0px 0px 0px 5px #81cdff;
  border: dashed 1px #fff;
  transition: 0.4s;

  &:hover {
    background: #668ad8;
    box-shadow: 0px 0px 0px 5px #668ad8;
  }
`;

const GET_COUNT = 3;

const Home: NextPage = () => {
  const [values, setValues] = useState({
    word: "",
    isLocal: false
  });
  const handleInputChange = (e: any) => {
    const target = e.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;
    
    setValues({ ...values, [name]: value });
  }

  const [result, setResult] = useState<Array<string>>([]);
  const [resultChecked, setResultChecked] = useState<Array<boolean>>([...Array(100).map(() => false)]);
  const [showList, setShowList] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [mount, setMount] = useState<boolean>(false);

  const finishSearch = (isLocal: boolean, list: string[]) => {
    setValues({...values, isLocal: isLocal});
    setResult(list);
    setResultChecked(list.map(() => false));
    setIsLoading(false);
    setShowList(false);
    setMount(true);
  }

  const search = () => {
    setIsLoading(true);
    searchWord(values.word).then((meanings: string[]) => {
      const isOnLine = typeof window !== 'undefined' ? navigator.onLine : false;

      if (meanings.length >= GET_COUNT || !isOnLine) {
        finishSearch(true, meanings);
        return;
      }

      axios.get(`https://polar-dawn-70145.herokuapp.com/to_english?word=${values.word}`).then((res) => {
        finishSearch(false, res.data.data.split(/\t/g));
      });
    })
  }

  const save = () => {
    setIsLoading(true);

    addMeanings(result.filter((_, index) => resultChecked[index]), values.word).then(() => {
      setShowList(true);
      setIsLoading(false);
    });
  }

  return (
    <Body className="App">
      <MainView style={{overflow: 'hidden'}}>
        <ColumnContainer>
          {
            showList ?
            <WordList setIsLoading={setIsLoading}></WordList>
          :
            <ResultList result={result} resultChecked={resultChecked} setResultChecked={setResultChecked} save={save}></ResultList>
          }
        </ColumnContainer>
      </MainView>
      <SearchTab search={search} mount={mount} handleInputChange={handleInputChange} word={values.word}></SearchTab>
      {
        showList ||
        <Float bottom={"8vw"} right={"8vw"}>
          <ListButton>
            <ColumnContainer style={{height: '100%'}} onClick={() => {setShowList(true); setMount(true);}}>
              <FontAwesomeIcon icon={faBars} style={{width: '10vw', height: '10vw'}} />
            </ColumnContainer>
          </ListButton>
        </Float>
      }
      {
        isLoading &&
        <Float top={"0"} left={"0"}>
          <ColumnContainer style={{height: '100vh', width: '100vw', opacity: 0.5, backgroundColor: 'black', pointerEvents: 'none', zIndex: 20}}>
            <Skeleton width="25vw" height="25vw" type="spinningBubbles"/>
          </ColumnContainer>
        </Float>
      }
    </Body>
  );
}

export default Home;
