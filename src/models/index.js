import * as homeService from '../services/services';
export default {
  namespace: 'index',
  state: {
    items: [],
    gamerInfo: []
  },
  reducers: {
    save(state, { payload: { data: items } }) {
      console.log({ ...state, items });
      return { ...state, items };
    },
    saveInfo(state, { payload: { data: gamerInfo } }) {
      console.log({ ...state, gamerInfo });
      return { ...state, gamerInfo };
    },
  },
  effects: {
    *fetch({ payload: { page = 1 } }, { call, put }) {
      const { data, headers } = yield call(homeService.fetch, { page });
      yield put({
        type: 'save',
        payload: {
          data: data.data,
        },
      });
    },
    *getGamerInfo({ payload: { } }, { call, put }) {
      const { data, headers } = yield call(homeService.getGamerInfo, {});
      yield put({
        type: 'saveInfo',
        payload: {
          data: data.data,
        },
      });
    },
    *remove({ payload: id }, { call, put, select }) {
      yield call(homeService.remove, id);
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },
    *patch({ payload: { id, values } }, { call, put, select }) {
      yield call(homeService.patch, id, values);
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },
    *create({ payload: values }, { call, put }) {
      yield call(homeService.create, values);
      yield put({ type: 'reload' });
    },
    *reload(action, { put, select }) {
      const page = yield select(state => state.users.page);
      yield put({ type: 'fetch', payload: { page } });
    },
  },
  subscriptions: {
    setup({ dispatch, history }) {
      return history.listen(({ pathname, query }) => {
        if (pathname === '/') {
          dispatch({ type: 'fetch', payload: query });
          dispatch({ type: 'getGamerInfo', payload: query });
        }
      });
    },
  },
};
