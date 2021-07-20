export default function reducer(state, action) {
  switch (action.type) {
    case "init":
      return {
        ...state,
        bestSellerCourses: action.payload.bestSellerCourses,
        categories: action.payload.categories,
        subCategories: action.payload.subCategories,
        latestCourses: action.payload.latestCourses,
      };
    default:
      return state;
  }
}
