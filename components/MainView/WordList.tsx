import React, { Dispatch, SetStateAction, useEffect, useState } from 'react';
import styled from '@emotion/styled';
import db, { Word } from '../../public/db';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { ColumnContainer, RowContainer } from '../common/Container';

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

const LIST_COUNT = 15;

type Props = {
    setIsLoading: Dispatch<SetStateAction<boolean>>
}

const WordList: React.FC<Props> = ({setIsLoading}) => {
  const [values, setValues] = useState({
    list: [] as Word[],
    pageIndex: 1,
  });

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

  useEffect(() => {
    setIsLoading(true);

    db.wordbook?.offset((values.pageIndex - 1) * LIST_COUNT).limit(LIST_COUNT).toArray().then((list_with_undefined) => {
      let new_list = list_with_undefined.filter((item): item is Word => !!item);
      
      setValues({...values, list: new_list })
      setIsLoading(false);
    })
  }, [values.pageIndex]);

  return (
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
  );
}

export default WordList;
