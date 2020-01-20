import { Module } from 'vuex'
import { User, RootState } from '@/types'

export interface State {
    items: User[];
    nextId: number;
}

const state = {
    items: [{
        id: 1,
        firstname: 'Foo',
        lastname: 'Bar',
        mail: 'foobar@example.com'
    }],
    nextId: 2,
} as State;

export default {
    namespaced: true,
    state,
    getters: {
        count(state) {
            return state.items.length;
        }
    },
    mutations: {
        addUser(state, user: User) {
            user.id = state.nextId;
            state.nextId = state.nextId + 1;
            state.items.push(user);
        }
    },
    actions: {
        addUser({ state, commit, rootState}, user) {
            commit('addUser', user);
        }
    }
} as Module<State, RootState>