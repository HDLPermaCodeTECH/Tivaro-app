
Object.defineProperty(exports, "__esModule", { value: true });

const {
  Decimal,
  objectEnumValues,
  makeStrictEnum,
  Public,
  getRuntime,
  skip
} = require('./runtime/index-browser.js')


const Prisma = {}

exports.Prisma = Prisma
exports.$Enums = {}

/**
 * Prisma Client JS version: 5.22.0
 * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
 */
Prisma.prismaVersion = {
  client: "5.22.0",
  engine: "605197351a3c8bdd595af2d2a9bc3025bca48ea2"
}

Prisma.PrismaClientKnownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientKnownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)};
Prisma.PrismaClientUnknownRequestError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientUnknownRequestError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientRustPanicError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientRustPanicError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientInitializationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientInitializationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.PrismaClientValidationError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`PrismaClientValidationError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.NotFoundError = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`NotFoundError is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.Decimal = Decimal

/**
 * Re-export of sql-template-tag
 */
Prisma.sql = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`sqltag is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.empty = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`empty is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.join = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`join is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.raw = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`raw is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.validator = Public.validator

/**
* Extensions
*/
Prisma.getExtensionContext = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.getExtensionContext is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}
Prisma.defineExtension = () => {
  const runtimeName = getRuntime().prettyName;
  throw new Error(`Extensions.defineExtension is unable to run in this browser environment, or has been bundled for the browser (running in ${runtimeName}).
In case this error is unexpected for you, please report it in https://pris.ly/prisma-prisma-bug-report`,
)}

/**
 * Shorthand utilities for JSON filtering
 */
Prisma.DbNull = objectEnumValues.instances.DbNull
Prisma.JsonNull = objectEnumValues.instances.JsonNull
Prisma.AnyNull = objectEnumValues.instances.AnyNull

Prisma.NullTypes = {
  DbNull: objectEnumValues.classes.DbNull,
  JsonNull: objectEnumValues.classes.JsonNull,
  AnyNull: objectEnumValues.classes.AnyNull
}



/**
 * Enums
 */

exports.Prisma.TransactionIsolationLevel = makeStrictEnum({
  Serializable: 'Serializable'
});

exports.Prisma.UserScalarFieldEnum = {
  id: 'id',
  email: 'email',
  password: 'password',
  plan: 'plan',
  role: 'role',
  name: 'name',
  owner_id: 'owner_id',
  business_name: 'business_name',
  business_address: 'business_address',
  business_phone: 'business_phone',
  business_logo: 'business_logo',
  receipt_footer: 'receipt_footer',
  daily_goal: 'daily_goal',
  last_login_at: 'last_login_at',
  is_suspended: 'is_suspended',
  created_at: 'created_at'
};

exports.Prisma.CustomerScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  name: 'name',
  email: 'email',
  phone: 'phone',
  address: 'address',
  created_at: 'created_at'
};

exports.Prisma.ProductScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  name: 'name',
  sku: 'sku',
  quantity: 'quantity',
  unit: 'unit',
  cost_price: 'cost_price',
  selling_price: 'selling_price',
  low_stock_threshold: 'low_stock_threshold',
  supplier_id: 'supplier_id',
  image_url: 'image_url',
  created_at: 'created_at'
};

exports.Prisma.SaleScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  customer_id: 'customer_id',
  total_amount: 'total_amount',
  payment_status: 'payment_status',
  cashier_id: 'cashier_id',
  created_at: 'created_at'
};

exports.Prisma.SaleItemScalarFieldEnum = {
  id: 'id',
  sale_id: 'sale_id',
  product_id: 'product_id',
  quantity: 'quantity',
  price: 'price',
  cost_price: 'cost_price'
};

exports.Prisma.ReceiptScalarFieldEnum = {
  id: 'id',
  sale_id: 'sale_id',
  user_id: 'user_id',
  created_at: 'created_at'
};

exports.Prisma.ExpenseScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  description: 'description',
  amount: 'amount',
  category: 'category',
  date: 'date',
  created_at: 'created_at'
};

exports.Prisma.ShiftReportScalarFieldEnum = {
  id: 'id',
  admin_id: 'admin_id',
  cashier_id: 'cashier_id',
  total_sales: 'total_sales',
  total_collections: 'total_collections',
  total_transactions: 'total_transactions',
  unpaid_sales_json: 'unpaid_sales_json',
  collections_json: 'collections_json',
  start_time: 'start_time',
  end_time: 'end_time',
  created_at: 'created_at'
};

exports.Prisma.SupplierScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  name: 'name',
  contact_person: 'contact_person',
  email: 'email',
  phone: 'phone',
  address: 'address',
  created_at: 'created_at'
};

exports.Prisma.DebtScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  customer_id: 'customer_id',
  customer_name: 'customer_name',
  amount: 'amount',
  remaining_amount: 'remaining_amount',
  due_date: 'due_date',
  status: 'status',
  notes: 'notes',
  sale_id: 'sale_id',
  created_at: 'created_at'
};

exports.Prisma.DebtPaymentScalarFieldEnum = {
  id: 'id',
  debt_id: 'debt_id',
  amount: 'amount',
  payment_method: 'payment_method',
  cashier_id: 'cashier_id',
  date: 'date',
  created_at: 'created_at'
};

exports.Prisma.MessageScalarFieldEnum = {
  id: 'id',
  user_id: 'user_id',
  content: 'content',
  status: 'status',
  reply: 'reply',
  replied_at: 'replied_at',
  attachment: 'attachment',
  created_at: 'created_at'
};

exports.Prisma.AnnouncementScalarFieldEnum = {
  id: 'id',
  title: 'title',
  content: 'content',
  type: 'type',
  created_at: 'created_at'
};

exports.Prisma.SortOrder = {
  asc: 'asc',
  desc: 'desc'
};

exports.Prisma.NullsOrder = {
  first: 'first',
  last: 'last'
};


exports.Prisma.ModelName = {
  User: 'User',
  Customer: 'Customer',
  Product: 'Product',
  Sale: 'Sale',
  SaleItem: 'SaleItem',
  Receipt: 'Receipt',
  Expense: 'Expense',
  ShiftReport: 'ShiftReport',
  Supplier: 'Supplier',
  Debt: 'Debt',
  DebtPayment: 'DebtPayment',
  Message: 'Message',
  Announcement: 'Announcement'
};

/**
 * This is a stub Prisma Client that will error at runtime if called.
 */
class PrismaClient {
  constructor() {
    return new Proxy(this, {
      get(target, prop) {
        let message
        const runtime = getRuntime()
        if (runtime.isEdge) {
          message = `PrismaClient is not configured to run in ${runtime.prettyName}. In order to run Prisma Client on edge runtime, either:
- Use Prisma Accelerate: https://pris.ly/d/accelerate
- Use Driver Adapters: https://pris.ly/d/driver-adapters
`;
        } else {
          message = 'PrismaClient is unable to run in this browser environment, or has been bundled for the browser (running in `' + runtime.prettyName + '`).'
        }
        
        message += `
If this is unexpected, please open an issue: https://pris.ly/prisma-prisma-bug-report`

        throw new Error(message)
      }
    })
  }
}

exports.PrismaClient = PrismaClient

Object.assign(exports, Prisma)
