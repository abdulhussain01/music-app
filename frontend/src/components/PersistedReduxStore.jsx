import  { useEffect, useState } from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import initializeStore from "../store/store";

const PersistedReduxStore = ({ children }) => {
  const [storeAndPersistor, setStoreAndPersistor] = useState(null);

  useEffect(() => {
    const initStore = async () => {
      const result = await initializeStore();
      setStoreAndPersistor(result);
    };
    initStore();
  }, []);

  if (!storeAndPersistor) {
    return <div>Loading...</div>;
  }

  return (
    <Provider store={storeAndPersistor.store}>
      <PersistGate loading={null} persistor={storeAndPersistor.persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
};

export default PersistedReduxStore;
