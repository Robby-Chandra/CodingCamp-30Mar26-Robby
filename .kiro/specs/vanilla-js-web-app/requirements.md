# Requirements Document

## Introduction

A client-side Expense & Budget Visualizer built with vanilla HTML, CSS, and JavaScript. Users can log expense transactions with a name, amount, and category, view a running total balance, browse a scrollable transaction list, and see a live pie chart of spending by category. All data persists in the browser's Local Storage with no backend required.

## Glossary

- **App**: The vanilla JavaScript single-page web application described in this document.
- **Transaction**: A single expense entry consisting of an item name, a monetary amount, and a category.
- **Category**: One of three fixed labels that classify a transaction — Food, Transport, or Fun.
- **Transaction_List**: The scrollable UI component that displays all stored transactions.
- **Balance_Display**: The UI component at the top of the page that shows the total sum of all transaction amounts.
- **Input_Form**: The HTML form through which the user enters a new transaction.
- **Chart**: The pie chart rendered by Chart.js that visualises spending distribution by category.
- **Local_Storage**: The browser's `localStorage` API used for client-side data persistence.

---

## Requirements

### Requirement 1: Add a Transaction

**User Story:** As a user, I want to fill in a form with an item name, amount, and category so that I can record a new expense.

#### Acceptance Criteria

1. THE Input_Form SHALL contain a text field for item name, a numeric field for amount, and a dropdown selector with the options Food, Transport, and Fun.
2. WHEN the user submits the Input_Form with all fields filled and a positive numeric amount, THE App SHALL add the transaction to the Transaction_List and persist it to Local_Storage.
3. WHEN the user submits the Input_Form with one or more empty fields, THE Input_Form SHALL display a validation error message and SHALL NOT add a transaction.
4. WHEN the user submits the Input_Form with an amount that is not a positive number, THE Input_Form SHALL display a validation error message and SHALL NOT add a transaction.
5. WHEN a transaction is successfully added, THE Input_Form SHALL reset all fields to their default empty state.

---

### Requirement 2: View and Delete Transactions

**User Story:** As a user, I want to see all my recorded expenses in a scrollable list and remove individual entries so that I can manage my transaction history.

#### Acceptance Criteria

1. THE Transaction_List SHALL display every stored transaction showing its item name, amount, and category.
2. WHEN the number of transactions exceeds the visible area, THE Transaction_List SHALL be scrollable to reveal all entries.
3. WHEN the user clicks the delete control on a transaction, THE App SHALL remove that transaction from the Transaction_List and from Local_Storage.
4. WHEN no transactions are stored, THE Transaction_List SHALL display an empty-state message indicating there are no transactions yet.

---

### Requirement 3: Display Total Balance

**User Story:** As a user, I want to see the total of all my expenses at a glance so that I know how much I have spent overall.

#### Acceptance Criteria

1. THE Balance_Display SHALL show the sum of the amounts of all stored transactions, formatted as a currency value.
2. WHEN a transaction is added, THE Balance_Display SHALL update to reflect the new total without requiring a page reload.
3. WHEN a transaction is deleted, THE Balance_Display SHALL update to reflect the new total without requiring a page reload.
4. WHEN no transactions are stored, THE Balance_Display SHALL show a total of zero.

---

### Requirement 4: Visualise Spending by Category

**User Story:** As a user, I want to see a pie chart of my spending broken down by category so that I can understand where my money is going.

#### Acceptance Criteria

1. THE Chart SHALL render a pie chart that shows the proportional spending for each category (Food, Transport, Fun) based on the sum of transaction amounts per category.
2. WHEN a transaction is added, THE Chart SHALL update automatically to reflect the new category totals without requiring a page reload.
3. WHEN a transaction is deleted, THE Chart SHALL update automatically to reflect the revised category totals without requiring a page reload.
4. WHEN only one or two categories have transactions, THE Chart SHALL render only the segments for categories that have a non-zero total.
5. WHEN no transactions are stored, THE Chart SHALL display an empty or placeholder state.

---

### Requirement 5: Persist Data Across Sessions

**User Story:** As a user, I want my transactions to be saved so that my data is still available when I reopen the app.

#### Acceptance Criteria

1. WHEN the App loads, THE App SHALL read all previously stored transactions from Local_Storage and render them in the Transaction_List, Balance_Display, and Chart.
2. WHEN a transaction is added or deleted, THE App SHALL write the updated transaction list to Local_Storage before the operation is considered complete.
3. IF Local_Storage is unavailable or returns a parse error, THEN THE App SHALL initialise with an empty transaction list and continue operating normally.

---

### Requirement 6: Technical and Non-Functional Constraints

**User Story:** As a developer, I want the app to follow defined technical constraints so that it remains simple, maintainable, and performant.

#### Acceptance Criteria

1. THE App SHALL be implemented using only HTML, CSS, and vanilla JavaScript with no backend server.
2. THE App SHALL contain exactly one CSS file located at `css/` and exactly one JavaScript file located at `js/`.
3. THE App SHALL load and become interactive in modern versions of Chrome, Firefox, Edge, and Safari.
4. WHEN the user interacts with the Input_Form, Transaction_List, Balance_Display, or Chart, THE App SHALL reflect the change within 100ms on a modern desktop browser.
5. THE App SHALL use Chart.js (loaded via CDN) as the charting library for the pie chart.
