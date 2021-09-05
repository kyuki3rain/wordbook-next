import axios from 'axios';
import db, { Word } from './db';

export const deleteWord = async (id: number) => {
    await db.wordbook?.delete(id)
}

export const getList = async (pageIndex: number, list_count: number) => {
    const list_with_undefined = await db.wordbook?.offset((pageIndex - 1) * list_count).limit(list_count).toArray()!;
    let new_list = list_with_undefined.filter((item): item is Word => !!item);

    return new_list;
}

export const addMeanings = async (meanings: string[], word: string) => {
    const add_items = meanings.map((item: string, index: number) => {
        return {
            word:  word, meaning: item, createdAt: Date.now()
        } as Word
    });

    await db.wordbook?.bulkAdd(add_items);
}

export const searchWord = async (word: string) => {
    const db_result = await db.wordbook?.where('word').equals(word).toArray();

    if (!db_result){
        return ["no content in local"];
    }

    return db_result.map((item) => item.meaning);
  }