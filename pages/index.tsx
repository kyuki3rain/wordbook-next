import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import { NextPage } from 'next';
import db, { Word } from '../public/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import Skeleton from 'react-loading';
import { Checkbox } from '@material-ui/core';

const ColumnContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center'
});

const RowContainer = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'center',
  alignItems: 'center'
});

const Body = styled(ColumnContainer)({
  height: '100vh',
  width: '100vw',
  backgroundColor: '#FFEDDA'
})

const Button = styled.div({
  borderRadius: 10,
  backgroundColor: '#564c46',
  fontSize: 20, color: 'white',
  paddingLeft: 10, paddingRight: 10, paddingTop: 3, paddingBottom: 3,
  ':active': {
    backgroundColor: 'black'
  },
  textAlign: 'center'
})

const Box = styled.div({
  padding: 30,
  overflow: 'scroll',
  height: '90vh'
})

const MainView = styled.div({
  width: '100vw',
  height: '90vh'
})

const WordBox = styled.div({
  width: '100vw',
  borderTop: 'black 1px solid',
  borderBottom: 'black 1px solid',
  marginBottom: -1,
  fontSize: 12
})

const PageText = styled.div({
  fontSize: 20
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

const LIST_COUNT = 15;
const GET_COUNT = 3;

const Home: NextPage = () => {
  const [values, setValues] = useState({
    word: "",
    list: [] as Word[],
    pageIndex: 1,
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

  const search = () => {
    setIsLoading(true);
    setShowList(false);
    db.wordbook?.where('word').equals(values.word).toArray().then((db_result) => {

      if (db_result.length >= GET_COUNT) {
        setValues({...values, isLocal: true});
        setResult(db_result.map((item) => item.meaning));
        setIsLoading(false);
        return;
      }

      const isOnLine = typeof window !== 'undefined' ? navigator.onLine : false;
      if (!isOnLine) {
        setValues({...values, isLocal: true});
        setResult(["no content in local"]);
        setIsLoading(false);
        return;
      }

      axios.get(`https://polar-dawn-70145.herokuapp.com/to_english?word=${values.word}`).then((res) => {
        const items = res.data.data.split(/\t/g);
        console.log(items);
        setResultChecked(items.map(() => false));
        setValues({...values, isLocal: false});
        setResult(items);
        setIsLoading(false);
      });
    })
  }

  const trash = (id: number) => {
    setIsLoading(true);
    
    db.wordbook?.delete(id).then(() => {
      db.wordbook?.offset((values.pageIndex - 1) * LIST_COUNT).limit(LIST_COUNT).toArray().then((list_with_undefined) => {
        let new_list = list_with_undefined.filter((item): item is Word => !!item);
        
        setValues({...values, list: new_list });
        setIsLoading(false);
      })
    })
  }

  const save = () => {
    setIsLoading(true);
    const add_items = result.map((item: string, index: number) => {
      if (resultChecked[index]){
        return {
          word: values.word, meaning: item, createdAt: Date.now()
        } as Word
      }
    }).filter((item): item is Word => !!item);

    console.log(add_items);

    db.wordbook?.bulkAdd(add_items).then((index) => {
      console.log("add word for index: " + index);
      setShowList(true);
      setIsLoading(false);
    })
  }

  const check = (index: number) => {
    let checked = resultChecked.slice();
    checked[index] = !checked[index];
    setResultChecked(checked);
  }

  useEffect(() => {
    if (!showList) {
      return;
    }

    setIsLoading(true);

    db.wordbook?.offset((values.pageIndex - 1) * LIST_COUNT).limit(LIST_COUNT).toArray().then((list_with_undefined) => {
      let new_list = list_with_undefined.filter((item): item is Word => !!item);
      
      setValues({...values, list: new_list })
      setIsLoading(false);
    })
  }, [values.pageIndex, result, showList]);

  return (
    <Body className="App">
      <ColumnContainer>
          <RowContainer style={{width: '100vw', height: '10vh', backgroundColor: '#FFB830'}}>
            <input
              type="text"
              name="word"
              defaultValue={values.word}
              onChange={handleInputChange}
              style={{marginRight: 10, fontSize: 24, width: '70vw', maxWidth: 400}}
            ></input>
            <Button
              onClick={search}>
              検索
            </Button>
          </RowContainer>
          <MainView style={{overflow: 'hidden'}}>
            <ColumnContainer>
              {
                showList ?
                <>
                  <RowContainer style={{justifyContent: 'space-around', width: '100%', height: '5.4vh'}}>
                    <PageText onClick={() => {
                      if (values.pageIndex == 1) return;
                      
                      setValues({...values, pageIndex: values.pageIndex - 1});
                    }}>{values.pageIndex == 1 ? "" :"<"}</PageText>
                    <PageText>{values.pageIndex}</PageText>
                    <PageText onClick={() => {
                      if(values.list.length != LIST_COUNT) return;
                      
                      setValues({...values, pageIndex: values.pageIndex + 1});
                    }}>{values.list.length != LIST_COUNT ? "" :">"}</PageText>
                  </RowContainer>
                  <ColumnContainer style={{height: '80vh', justifyContent: 'start'}}>
                    {values.list.map((item, index) => {
                      return (
                        <WordBox key={index}>
                          <RowContainer style={{height: '5.4vh'}}>
                            <div style={{flex: 1, paddingLeft: 5, paddingRight: 5}}>{item.word}</div>
                            <div style={{flex: 4, borderLeft: 'black 1px solid', paddingLeft: 5, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis'}}>{item.meaning}</div>
                            <FontAwesomeIcon icon={faTrashAlt} style={{height: '3vh', marginRight: 10, marginLeft: 10}} onClick={() => {trash(item.id)}} />
                          </RowContainer>
                        </WordBox>
                      );
                    })}
                  </ColumnContainer>
                </>
              :
                <Box>
                  {result.map((item, index) => {
                    return <RowContainer key={index}>
                      <Checkbox checked={resultChecked[index]} name="resultChecked" onChange={() => { check(index) }}></Checkbox>
                      <div style={{flex: 1, fontSize: 15}}>{item}</div>
                    </RowContainer>;
                  })}
                  {result.length > 0 && <Button onClick={save} style={{padding: 4}}>save</Button>}
                </Box>
              }
            </ColumnContainer>
          </MainView>
      </ColumnContainer>
      {
        showList ||
        <Float bottom={"8vw"} right={"8vw"}>
          <ListButton>
            <ColumnContainer style={{height: '100%'}} onClick={() => setShowList(true)}>
              <FontAwesomeIcon icon={faBars} style={{width: '10vw', height: '10vw'}} />
            </ColumnContainer>
          </ListButton>
        </Float>
      }
      {
        isLoading &&
        <Float top={"0"} left={"0"}>
          <ColumnContainer style={{height: '100vh', width: '100vw', opacity: 0.5, backgroundColor: 'black', pointerEvents: 'none'}}>
            <Skeleton width="25vw" height="25vw" type="spinningBubbles"/>
          </ColumnContainer>
        </Float>
      }
    </Body>
  );
}

export default Home;
