import { createContext } from "react";

// Default is null — useDiscrepancyStyles checks for this to know
// whether we're inside a comparison view (Provider present) or not.
const DiscrepancyContext = createContext(null);

export default DiscrepancyContext;