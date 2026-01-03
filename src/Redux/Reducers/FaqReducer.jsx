import { produce } from 'immer';

const initialState = {
    faqs: [],
    loading: true,

};

export const faqReducer = (state = initialState, action) => {
    return produce(state, draft => {
        switch (action.type) {

            case 'FETCH_FAQS_SUCCESS':
                draft.faqs = action.payload;
                draft.loading = false;
                break;

            case 'UPDATE_FAQ_SUCCESS':
                const updatedFaq = action.payload;
                const index = draft.faqs.findIndex(faq => faq.id === updatedFaq.id);
                if (index !== -1) {
                    draft.faqs[index] = updatedFaq;
                }
                break;

            case 'DELETE_FAQ_SUCCESS':
                const id = action.payload;
                draft.faqs = draft.faqs.filter(faq => faq.id !== id);
                break;

            default:
                break;
        }
    });
};



