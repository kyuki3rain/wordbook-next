import Dexie from 'dexie';

/**
 * IndexedDBに保存するオブジェクト
 */
export interface Word {
  id: number;
  word: string | null;
  meaning: string;
  createdAt: number | null;
}

/**
 * IndexedDBをラップするDexieクラス
 */
export class WordbookDB extends Dexie {

  // テーブルをプロパティとして定義
  // ジェネリックの1つ目はストアするオブジェクト、2つ目はキーの型
  wordbook: Dexie.Table<Word, number> | undefined;

  constructor() {
    super('wordbook-db'); // データベース名をsuperのコンストラクタに渡す

    // テーブルとインデックスを定義する
    this.version(1).stores({
        wordbook: '++id, word, meaning, createdAt',
    });
  }
}

export default new WordbookDB();

