In React, you can create a modal system where a deeply nested component can display content elsewhere in the DOM using **Portals**. Portals allow you to render a component outside of its parent DOM hierarchy while still being part of the same React component tree.

Here’s how you can implement a modal system using Portals to display content outside of the nested component's direct part of the DOM.

### Step-by-Step Guide to Creating a Modal System with React Portals

1. **Create a `Modal` component**: This component will render its children outside of the normal DOM hierarchy using React Portals.
2. **Define a Modal Root in the DOM**: This will be the container where all modals will be displayed.
3. **Use Context or Props to Open the Modal**: A deep-nested component can trigger the modal using React's Context API or a prop passed down from a higher-level component.

### Example Code:

#### 1. Add a Modal Root in `index.html`
In your `index.html` file, add a `div` that will act as the modal root.

```html
<!-- index.html -->
<body>
  <div id="root"></div>
  <div id="modal-root"></div> <!-- Modal container -->
</body>
```

#### 2. Create a `Modal` Component Using React Portals

```javascript
import React from 'react';
import ReactDOM from 'react-dom';

// Modal component
const Modal = ({ children }) => {
  // Find the modal-root in the DOM
  const modalRoot = document.getElementById('modal-root');

  // Render the children in the modalRoot using a portal
  return ReactDOM.createPortal(
    <div className="modal">
      <div className="modal-content">
        {children}
      </div>
    </div>,
    modalRoot
  );
};

export default Modal;
```

#### 3. Define a `ModalContext` to Control the Modal

Use React's Context API to make it easy for deeply nested components to control the modal.

```javascript
import React, { useState, createContext, useContext } from 'react';
import Modal from './Modal';

// Create a ModalContext
const ModalContext = createContext();

// ModalProvider component that will wrap around your app
export const ModalProvider = ({ children }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);

  const showModal = (content) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setModalContent(null);
  };

  return (
    <ModalContext.Provider value={{ showModal, closeModal }}>
      {children}

      {isModalOpen && (
        <Modal>
          {modalContent}
          <button onClick={closeModal}>Close</button>
        </Modal>
      )}
    </ModalContext.Provider>
  );
};

// Hook to use modal context
export const useModal = () => useContext(ModalContext);
```

#### 4. Use the Modal in Deeply Nested Components

Now, any component, no matter how deeply nested, can open the modal by calling `showModal`.

```javascript
import React from 'react';
import { useModal } from './ModalProvider';

const DeepNestedComponent = () => {
  const { showModal } = useModal();

  const openModal = () => {
    showModal(
      <div>
        <h2>This is the Modal Content</h2>
        <p>It can be rendered from anywhere in the component tree!</p>
      </div>
    );
  };

  return (
    <div>
      <h3>Deep Nested Component</h3>
      <button onClick={openModal}>Open Modal</button>
    </div>
  );
};

export default DeepNestedComponent;
```

#### 5. Wrap Your App with the `ModalProvider`

Finally, wrap your entire app (or the part that needs access to the modal) with the `ModalProvider`.

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { ModalProvider } from './ModalProvider';
import DeepNestedComponent from './DeepNestedComponent';

const App = () => (
  <ModalProvider>
    <div>
      <h1>My App</h1>
      <DeepNestedComponent />
    </div>
  </ModalProvider>
);

ReactDOM.render(<App />, document.getElementById('root'));
```

### Explanation:

1. **Portals**: The `Modal` component uses React Portals to render its children into a DOM node (`#modal-root`) that exists outside the usual DOM hierarchy where the component is defined.
   
2. **Context API**: The `ModalContext` allows deeply nested components to trigger the modal by calling `showModal()` without the need to pass props manually through the entire component tree.

3. **Reusability**: By using this structure, any part of your application can easily open and close the modal without worrying about its actual position in the DOM.

### Conclusion:
Using React **Portals** in combination with **Context API**, you can create a powerful and reusable modal system that can be triggered from deeply nested components, while still displaying the modal content elsewhere in the DOM.