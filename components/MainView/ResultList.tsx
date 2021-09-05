import React from 'react';
import styled from '@emotion/styled';
import { Checkbox } from '@material-ui/core';
import { RowContainer } from '../common/Container';

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

const Box = styled.div({
  padding: 30,
  overflow: 'scroll',
  height: '90vh',
  width: '100vw'
})

type Props = {
    result: string[],
    setResultChecked: React.Dispatch<React.SetStateAction<boolean[]>>,
    save: () => void,
    resultChecked: boolean[],
}

const ResultList: React.FC<Props> = ({ result, save, resultChecked, setResultChecked }) => {
  const check = (index: number) => {
    let checked = resultChecked.slice();
    checked[index] = !checked[index];
    setResultChecked(checked);
  }

  return (
    <Box>
        {result.map((item, index) => {
        if(item === "no content") {
            return <div style={{flex: 1, fontSize: 15}}>{item}</div>
        }
        return <RowContainer key={index}>
            <Checkbox checked={resultChecked[index] || false} name="resultChecked" onChange={() => { check(index) }}></Checkbox>
            <div style={{flex: 1, fontSize: 15}}>{item}</div>
        </RowContainer>;
        })}
        {result.length > 0 && result[0] !== "no content" && <Button onClick={save} style={{padding: 4, marginTop: 20}}>save</Button>}
    </Box>
  );
}

export default ResultList;
