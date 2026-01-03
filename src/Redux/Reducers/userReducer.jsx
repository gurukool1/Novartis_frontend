import { produce } from 'immer';

const initialState = {
  users: [],
  assignedCases: [],
  assignedUsers: [],
  assignedUsersByCaseId: [],
  loading: true,
  error: {},
  dashboardData: [],
};

export const userReducer = (state = initialState, action) => {
  const { type, payload } = action;

  return produce(state, draft => {
    switch (type) {
      case 'GET_USERS_SUCCESS':
        draft.users = payload;
        draft.loading = false;
        break;

      case 'GET_ASSIGNED_CASES_SUCCESS_USER':
        draft.assignedCases = action.payload;
        draft.loading = false;
        break;

      case 'UPDATE_USER_STATUS_SUCCESS':
        return {
          ...state,
          users: state.users.map(user =>
            user.id === action.payload.userId
              ? {
                ...user,
                isActive: action.payload.status === 'active'
              }
              : user
          )
        };

      case 'DELETE_USER_SUCCESS':
        draft.users = draft.users.filter(user => user.id !== payload);
        break;

      case 'PERMANENT_DELETE_USER_SUCCESS':
        draft.users = draft.users.filter(user => user.id !== payload);
        break;
      // case 'UNASSIGN_CASE_SUCCESS':
      //   draft.assignedUsers = draft.assignedUsers.filter(
      //     assigned => assigned.userId !== payload.userId
      //   );
      //   break;

      case 'UNASSIGN_CASE_SUCCESS':
        draft.assignedUsers = draft.assignedUsers.filter(
          assigned => assigned.id !== payload.id
        );
        break;

      case 'GET_ASSIGNED_USERS_SUCCESS':
        draft.assignedUsers = action.payload;
        draft.error = null;
        break;


      case 'GET_ASSIGNED_USERS_BY_CASE_SUCCESS':
        draft.assignedUsersByCaseId[payload.caseId] = payload.assignedUsers;
        draft.loading = false;
        break;

      case 'GET_USERS_FAIL':
      case 'UPDATE_USER_STATUS_FAIL':
      case 'DELETE_USER_FAIL':
        draft.error = payload;
        draft.loading = false;
        break;


      case 'GET_DASHBOARD_DATA_SUCCESS':
        return produce(state, (draft) => {
          draft.dashboardData = action.payload;
          draft.loading = false;
        });


      case 'EDIT_USER_DETAILS_SUCCESS':
        return produce(state, draft => {
          const userIndex = draft.users.findIndex(
            user => user.id === action.payload.userId
          );

          if (userIndex !== -1) {
            draft.users[userIndex] = {
              ...draft.users[userIndex],
              ...action.payload.updatedProfile,
            };
          }
        });




      case 'ASSIGN_MULTIPLE_USERS_SUCCESS':
        return produce(state, draft => {
          // Add new assignments to existing ones
          action.payload.forEach(user => {
            if (!draft.assignedUsers.some(u => u.userId === user.userId)) {
              draft.assignedUsers.push(user);
            }
          });
        });

      default:
        break;
    }
  });
};




