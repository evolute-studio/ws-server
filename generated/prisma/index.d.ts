
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model Lobby
 * 
 */
export type Lobby = $Result.DefaultSelection<Prisma.$LobbyPayload>
/**
 * Model LobbyPlayer
 * 
 */
export type LobbyPlayer = $Result.DefaultSelection<Prisma.$LobbyPlayerPayload>
/**
 * Model ChatMessage
 * 
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>
/**
 * Model Invitation
 * 
 */
export type Invitation = $Result.DefaultSelection<Prisma.$InvitationPayload>

/**
 * Enums
 */
export namespace $Enums {
  export const LobbyStatus: {
  waiting: 'waiting',
  ready: 'ready'
};

export type LobbyStatus = (typeof LobbyStatus)[keyof typeof LobbyStatus]


export const PlayerRole: {
  player: 'player',
  spectator: 'spectator'
};

export type PlayerRole = (typeof PlayerRole)[keyof typeof PlayerRole]


export const InvitationStatus: {
  pending: 'pending',
  accepted: 'accepted',
  declined: 'declined',
  expired: 'expired'
};

export type InvitationStatus = (typeof InvitationStatus)[keyof typeof InvitationStatus]

}

export type LobbyStatus = $Enums.LobbyStatus

export const LobbyStatus: typeof $Enums.LobbyStatus

export type PlayerRole = $Enums.PlayerRole

export const PlayerRole: typeof $Enums.PlayerRole

export type InvitationStatus = $Enums.InvitationStatus

export const InvitationStatus: typeof $Enums.InvitationStatus

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Lobbies
 * const lobbies = await prisma.lobby.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Lobbies
   * const lobbies = await prisma.lobby.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.lobby`: Exposes CRUD operations for the **Lobby** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Lobbies
    * const lobbies = await prisma.lobby.findMany()
    * ```
    */
  get lobby(): Prisma.LobbyDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.lobbyPlayer`: Exposes CRUD operations for the **LobbyPlayer** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LobbyPlayers
    * const lobbyPlayers = await prisma.lobbyPlayer.findMany()
    * ```
    */
  get lobbyPlayer(): Prisma.LobbyPlayerDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.invitation`: Exposes CRUD operations for the **Invitation** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Invitations
    * const invitations = await prisma.invitation.findMany()
    * ```
    */
  get invitation(): Prisma.InvitationDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    Lobby: 'Lobby',
    LobbyPlayer: 'LobbyPlayer',
    ChatMessage: 'ChatMessage',
    Invitation: 'Invitation'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "lobby" | "lobbyPlayer" | "chatMessage" | "invitation"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      Lobby: {
        payload: Prisma.$LobbyPayload<ExtArgs>
        fields: Prisma.LobbyFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LobbyFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LobbyFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPayload>
          }
          findFirst: {
            args: Prisma.LobbyFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LobbyFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPayload>
          }
          findMany: {
            args: Prisma.LobbyFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPayload>[]
          }
          create: {
            args: Prisma.LobbyCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPayload>
          }
          createMany: {
            args: Prisma.LobbyCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LobbyCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPayload>[]
          }
          delete: {
            args: Prisma.LobbyDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPayload>
          }
          update: {
            args: Prisma.LobbyUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPayload>
          }
          deleteMany: {
            args: Prisma.LobbyDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LobbyUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LobbyUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPayload>[]
          }
          upsert: {
            args: Prisma.LobbyUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPayload>
          }
          aggregate: {
            args: Prisma.LobbyAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLobby>
          }
          groupBy: {
            args: Prisma.LobbyGroupByArgs<ExtArgs>
            result: $Utils.Optional<LobbyGroupByOutputType>[]
          }
          count: {
            args: Prisma.LobbyCountArgs<ExtArgs>
            result: $Utils.Optional<LobbyCountAggregateOutputType> | number
          }
        }
      }
      LobbyPlayer: {
        payload: Prisma.$LobbyPlayerPayload<ExtArgs>
        fields: Prisma.LobbyPlayerFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LobbyPlayerFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPlayerPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LobbyPlayerFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPlayerPayload>
          }
          findFirst: {
            args: Prisma.LobbyPlayerFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPlayerPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LobbyPlayerFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPlayerPayload>
          }
          findMany: {
            args: Prisma.LobbyPlayerFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPlayerPayload>[]
          }
          create: {
            args: Prisma.LobbyPlayerCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPlayerPayload>
          }
          createMany: {
            args: Prisma.LobbyPlayerCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.LobbyPlayerCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPlayerPayload>[]
          }
          delete: {
            args: Prisma.LobbyPlayerDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPlayerPayload>
          }
          update: {
            args: Prisma.LobbyPlayerUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPlayerPayload>
          }
          deleteMany: {
            args: Prisma.LobbyPlayerDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LobbyPlayerUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.LobbyPlayerUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPlayerPayload>[]
          }
          upsert: {
            args: Prisma.LobbyPlayerUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LobbyPlayerPayload>
          }
          aggregate: {
            args: Prisma.LobbyPlayerAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLobbyPlayer>
          }
          groupBy: {
            args: Prisma.LobbyPlayerGroupByArgs<ExtArgs>
            result: $Utils.Optional<LobbyPlayerGroupByOutputType>[]
          }
          count: {
            args: Prisma.LobbyPlayerCountArgs<ExtArgs>
            result: $Utils.Optional<LobbyPlayerCountAggregateOutputType> | number
          }
        }
      }
      ChatMessage: {
        payload: Prisma.$ChatMessagePayload<ExtArgs>
        fields: Prisma.ChatMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findFirst: {
            args: Prisma.ChatMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findMany: {
            args: Prisma.ChatMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          create: {
            args: Prisma.ChatMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          createMany: {
            args: Prisma.ChatMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.ChatMessageCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          delete: {
            args: Prisma.ChatMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          update: {
            args: Prisma.ChatMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          deleteMany: {
            args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.ChatMessageUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          upsert: {
            args: Prisma.ChatMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          aggregate: {
            args: Prisma.ChatMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMessage>
          }
          groupBy: {
            args: Prisma.ChatMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageGroupByOutputType>[]
          }
          count: {
            args: Prisma.ChatMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageCountAggregateOutputType> | number
          }
        }
      }
      Invitation: {
        payload: Prisma.$InvitationPayload<ExtArgs>
        fields: Prisma.InvitationFieldRefs
        operations: {
          findUnique: {
            args: Prisma.InvitationFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.InvitationFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          findFirst: {
            args: Prisma.InvitationFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.InvitationFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          findMany: {
            args: Prisma.InvitationFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>[]
          }
          create: {
            args: Prisma.InvitationCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          createMany: {
            args: Prisma.InvitationCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          createManyAndReturn: {
            args: Prisma.InvitationCreateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>[]
          }
          delete: {
            args: Prisma.InvitationDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          update: {
            args: Prisma.InvitationUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          deleteMany: {
            args: Prisma.InvitationDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.InvitationUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateManyAndReturn: {
            args: Prisma.InvitationUpdateManyAndReturnArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>[]
          }
          upsert: {
            args: Prisma.InvitationUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$InvitationPayload>
          }
          aggregate: {
            args: Prisma.InvitationAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateInvitation>
          }
          groupBy: {
            args: Prisma.InvitationGroupByArgs<ExtArgs>
            result: $Utils.Optional<InvitationGroupByOutputType>[]
          }
          count: {
            args: Prisma.InvitationCountArgs<ExtArgs>
            result: $Utils.Optional<InvitationCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    lobby?: LobbyOmit
    lobbyPlayer?: LobbyPlayerOmit
    chatMessage?: ChatMessageOmit
    invitation?: InvitationOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type LobbyCountOutputType
   */

  export type LobbyCountOutputType = {
    players: number
    chatMessages: number
  }

  export type LobbyCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    players?: boolean | LobbyCountOutputTypeCountPlayersArgs
    chatMessages?: boolean | LobbyCountOutputTypeCountChatMessagesArgs
  }

  // Custom InputTypes
  /**
   * LobbyCountOutputType without action
   */
  export type LobbyCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyCountOutputType
     */
    select?: LobbyCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * LobbyCountOutputType without action
   */
  export type LobbyCountOutputTypeCountPlayersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LobbyPlayerWhereInput
  }

  /**
   * LobbyCountOutputType without action
   */
  export type LobbyCountOutputTypeCountChatMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model Lobby
   */

  export type AggregateLobby = {
    _count: LobbyCountAggregateOutputType | null
    _min: LobbyMinAggregateOutputType | null
    _max: LobbyMaxAggregateOutputType | null
  }

  export type LobbyMinAggregateOutputType = {
    id: string | null
    code: string | null
    hostAddress: string | null
    status: $Enums.LobbyStatus | null
    created: Date | null
    lastActivity: Date | null
    currentMatch: string | null
  }

  export type LobbyMaxAggregateOutputType = {
    id: string | null
    code: string | null
    hostAddress: string | null
    status: $Enums.LobbyStatus | null
    created: Date | null
    lastActivity: Date | null
    currentMatch: string | null
  }

  export type LobbyCountAggregateOutputType = {
    id: number
    code: number
    hostAddress: number
    status: number
    created: number
    lastActivity: number
    currentMatch: number
    _all: number
  }


  export type LobbyMinAggregateInputType = {
    id?: true
    code?: true
    hostAddress?: true
    status?: true
    created?: true
    lastActivity?: true
    currentMatch?: true
  }

  export type LobbyMaxAggregateInputType = {
    id?: true
    code?: true
    hostAddress?: true
    status?: true
    created?: true
    lastActivity?: true
    currentMatch?: true
  }

  export type LobbyCountAggregateInputType = {
    id?: true
    code?: true
    hostAddress?: true
    status?: true
    created?: true
    lastActivity?: true
    currentMatch?: true
    _all?: true
  }

  export type LobbyAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lobby to aggregate.
     */
    where?: LobbyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lobbies to fetch.
     */
    orderBy?: LobbyOrderByWithRelationInput | LobbyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LobbyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lobbies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lobbies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Lobbies
    **/
    _count?: true | LobbyCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LobbyMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LobbyMaxAggregateInputType
  }

  export type GetLobbyAggregateType<T extends LobbyAggregateArgs> = {
        [P in keyof T & keyof AggregateLobby]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLobby[P]>
      : GetScalarType<T[P], AggregateLobby[P]>
  }




  export type LobbyGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LobbyWhereInput
    orderBy?: LobbyOrderByWithAggregationInput | LobbyOrderByWithAggregationInput[]
    by: LobbyScalarFieldEnum[] | LobbyScalarFieldEnum
    having?: LobbyScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LobbyCountAggregateInputType | true
    _min?: LobbyMinAggregateInputType
    _max?: LobbyMaxAggregateInputType
  }

  export type LobbyGroupByOutputType = {
    id: string
    code: string
    hostAddress: string
    status: $Enums.LobbyStatus
    created: Date
    lastActivity: Date
    currentMatch: string | null
    _count: LobbyCountAggregateOutputType | null
    _min: LobbyMinAggregateOutputType | null
    _max: LobbyMaxAggregateOutputType | null
  }

  type GetLobbyGroupByPayload<T extends LobbyGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LobbyGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LobbyGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LobbyGroupByOutputType[P]>
            : GetScalarType<T[P], LobbyGroupByOutputType[P]>
        }
      >
    >


  export type LobbySelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    hostAddress?: boolean
    status?: boolean
    created?: boolean
    lastActivity?: boolean
    currentMatch?: boolean
    players?: boolean | Lobby$playersArgs<ExtArgs>
    chatMessages?: boolean | Lobby$chatMessagesArgs<ExtArgs>
    _count?: boolean | LobbyCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lobby"]>

  export type LobbySelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    hostAddress?: boolean
    status?: boolean
    created?: boolean
    lastActivity?: boolean
    currentMatch?: boolean
  }, ExtArgs["result"]["lobby"]>

  export type LobbySelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    code?: boolean
    hostAddress?: boolean
    status?: boolean
    created?: boolean
    lastActivity?: boolean
    currentMatch?: boolean
  }, ExtArgs["result"]["lobby"]>

  export type LobbySelectScalar = {
    id?: boolean
    code?: boolean
    hostAddress?: boolean
    status?: boolean
    created?: boolean
    lastActivity?: boolean
    currentMatch?: boolean
  }

  export type LobbyOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "code" | "hostAddress" | "status" | "created" | "lastActivity" | "currentMatch", ExtArgs["result"]["lobby"]>
  export type LobbyInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    players?: boolean | Lobby$playersArgs<ExtArgs>
    chatMessages?: boolean | Lobby$chatMessagesArgs<ExtArgs>
    _count?: boolean | LobbyCountOutputTypeDefaultArgs<ExtArgs>
  }
  export type LobbyIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}
  export type LobbyIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {}

  export type $LobbyPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Lobby"
    objects: {
      players: Prisma.$LobbyPlayerPayload<ExtArgs>[]
      chatMessages: Prisma.$ChatMessagePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      code: string
      hostAddress: string
      status: $Enums.LobbyStatus
      created: Date
      lastActivity: Date
      currentMatch: string | null
    }, ExtArgs["result"]["lobby"]>
    composites: {}
  }

  type LobbyGetPayload<S extends boolean | null | undefined | LobbyDefaultArgs> = $Result.GetResult<Prisma.$LobbyPayload, S>

  type LobbyCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LobbyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LobbyCountAggregateInputType | true
    }

  export interface LobbyDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Lobby'], meta: { name: 'Lobby' } }
    /**
     * Find zero or one Lobby that matches the filter.
     * @param {LobbyFindUniqueArgs} args - Arguments to find a Lobby
     * @example
     * // Get one Lobby
     * const lobby = await prisma.lobby.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LobbyFindUniqueArgs>(args: SelectSubset<T, LobbyFindUniqueArgs<ExtArgs>>): Prisma__LobbyClient<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Lobby that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LobbyFindUniqueOrThrowArgs} args - Arguments to find a Lobby
     * @example
     * // Get one Lobby
     * const lobby = await prisma.lobby.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LobbyFindUniqueOrThrowArgs>(args: SelectSubset<T, LobbyFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LobbyClient<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lobby that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyFindFirstArgs} args - Arguments to find a Lobby
     * @example
     * // Get one Lobby
     * const lobby = await prisma.lobby.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LobbyFindFirstArgs>(args?: SelectSubset<T, LobbyFindFirstArgs<ExtArgs>>): Prisma__LobbyClient<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Lobby that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyFindFirstOrThrowArgs} args - Arguments to find a Lobby
     * @example
     * // Get one Lobby
     * const lobby = await prisma.lobby.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LobbyFindFirstOrThrowArgs>(args?: SelectSubset<T, LobbyFindFirstOrThrowArgs<ExtArgs>>): Prisma__LobbyClient<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Lobbies that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Lobbies
     * const lobbies = await prisma.lobby.findMany()
     * 
     * // Get first 10 Lobbies
     * const lobbies = await prisma.lobby.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lobbyWithIdOnly = await prisma.lobby.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LobbyFindManyArgs>(args?: SelectSubset<T, LobbyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Lobby.
     * @param {LobbyCreateArgs} args - Arguments to create a Lobby.
     * @example
     * // Create one Lobby
     * const Lobby = await prisma.lobby.create({
     *   data: {
     *     // ... data to create a Lobby
     *   }
     * })
     * 
     */
    create<T extends LobbyCreateArgs>(args: SelectSubset<T, LobbyCreateArgs<ExtArgs>>): Prisma__LobbyClient<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Lobbies.
     * @param {LobbyCreateManyArgs} args - Arguments to create many Lobbies.
     * @example
     * // Create many Lobbies
     * const lobby = await prisma.lobby.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LobbyCreateManyArgs>(args?: SelectSubset<T, LobbyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Lobbies and returns the data saved in the database.
     * @param {LobbyCreateManyAndReturnArgs} args - Arguments to create many Lobbies.
     * @example
     * // Create many Lobbies
     * const lobby = await prisma.lobby.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Lobbies and only return the `id`
     * const lobbyWithIdOnly = await prisma.lobby.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LobbyCreateManyAndReturnArgs>(args?: SelectSubset<T, LobbyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Lobby.
     * @param {LobbyDeleteArgs} args - Arguments to delete one Lobby.
     * @example
     * // Delete one Lobby
     * const Lobby = await prisma.lobby.delete({
     *   where: {
     *     // ... filter to delete one Lobby
     *   }
     * })
     * 
     */
    delete<T extends LobbyDeleteArgs>(args: SelectSubset<T, LobbyDeleteArgs<ExtArgs>>): Prisma__LobbyClient<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Lobby.
     * @param {LobbyUpdateArgs} args - Arguments to update one Lobby.
     * @example
     * // Update one Lobby
     * const lobby = await prisma.lobby.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LobbyUpdateArgs>(args: SelectSubset<T, LobbyUpdateArgs<ExtArgs>>): Prisma__LobbyClient<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Lobbies.
     * @param {LobbyDeleteManyArgs} args - Arguments to filter Lobbies to delete.
     * @example
     * // Delete a few Lobbies
     * const { count } = await prisma.lobby.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LobbyDeleteManyArgs>(args?: SelectSubset<T, LobbyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lobbies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Lobbies
     * const lobby = await prisma.lobby.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LobbyUpdateManyArgs>(args: SelectSubset<T, LobbyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Lobbies and returns the data updated in the database.
     * @param {LobbyUpdateManyAndReturnArgs} args - Arguments to update many Lobbies.
     * @example
     * // Update many Lobbies
     * const lobby = await prisma.lobby.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Lobbies and only return the `id`
     * const lobbyWithIdOnly = await prisma.lobby.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LobbyUpdateManyAndReturnArgs>(args: SelectSubset<T, LobbyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Lobby.
     * @param {LobbyUpsertArgs} args - Arguments to update or create a Lobby.
     * @example
     * // Update or create a Lobby
     * const lobby = await prisma.lobby.upsert({
     *   create: {
     *     // ... data to create a Lobby
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Lobby we want to update
     *   }
     * })
     */
    upsert<T extends LobbyUpsertArgs>(args: SelectSubset<T, LobbyUpsertArgs<ExtArgs>>): Prisma__LobbyClient<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Lobbies.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyCountArgs} args - Arguments to filter Lobbies to count.
     * @example
     * // Count the number of Lobbies
     * const count = await prisma.lobby.count({
     *   where: {
     *     // ... the filter for the Lobbies we want to count
     *   }
     * })
    **/
    count<T extends LobbyCountArgs>(
      args?: Subset<T, LobbyCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LobbyCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Lobby.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LobbyAggregateArgs>(args: Subset<T, LobbyAggregateArgs>): Prisma.PrismaPromise<GetLobbyAggregateType<T>>

    /**
     * Group by Lobby.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LobbyGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LobbyGroupByArgs['orderBy'] }
        : { orderBy?: LobbyGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LobbyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLobbyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Lobby model
   */
  readonly fields: LobbyFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Lobby.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LobbyClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    players<T extends Lobby$playersArgs<ExtArgs> = {}>(args?: Subset<T, Lobby$playersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    chatMessages<T extends Lobby$chatMessagesArgs<ExtArgs> = {}>(args?: Subset<T, Lobby$chatMessagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Lobby model
   */
  interface LobbyFieldRefs {
    readonly id: FieldRef<"Lobby", 'String'>
    readonly code: FieldRef<"Lobby", 'String'>
    readonly hostAddress: FieldRef<"Lobby", 'String'>
    readonly status: FieldRef<"Lobby", 'LobbyStatus'>
    readonly created: FieldRef<"Lobby", 'DateTime'>
    readonly lastActivity: FieldRef<"Lobby", 'DateTime'>
    readonly currentMatch: FieldRef<"Lobby", 'String'>
  }
    

  // Custom InputTypes
  /**
   * Lobby findUnique
   */
  export type LobbyFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyInclude<ExtArgs> | null
    /**
     * Filter, which Lobby to fetch.
     */
    where: LobbyWhereUniqueInput
  }

  /**
   * Lobby findUniqueOrThrow
   */
  export type LobbyFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyInclude<ExtArgs> | null
    /**
     * Filter, which Lobby to fetch.
     */
    where: LobbyWhereUniqueInput
  }

  /**
   * Lobby findFirst
   */
  export type LobbyFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyInclude<ExtArgs> | null
    /**
     * Filter, which Lobby to fetch.
     */
    where?: LobbyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lobbies to fetch.
     */
    orderBy?: LobbyOrderByWithRelationInput | LobbyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lobbies.
     */
    cursor?: LobbyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lobbies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lobbies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lobbies.
     */
    distinct?: LobbyScalarFieldEnum | LobbyScalarFieldEnum[]
  }

  /**
   * Lobby findFirstOrThrow
   */
  export type LobbyFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyInclude<ExtArgs> | null
    /**
     * Filter, which Lobby to fetch.
     */
    where?: LobbyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lobbies to fetch.
     */
    orderBy?: LobbyOrderByWithRelationInput | LobbyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Lobbies.
     */
    cursor?: LobbyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lobbies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lobbies.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Lobbies.
     */
    distinct?: LobbyScalarFieldEnum | LobbyScalarFieldEnum[]
  }

  /**
   * Lobby findMany
   */
  export type LobbyFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyInclude<ExtArgs> | null
    /**
     * Filter, which Lobbies to fetch.
     */
    where?: LobbyWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Lobbies to fetch.
     */
    orderBy?: LobbyOrderByWithRelationInput | LobbyOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Lobbies.
     */
    cursor?: LobbyWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Lobbies from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Lobbies.
     */
    skip?: number
    distinct?: LobbyScalarFieldEnum | LobbyScalarFieldEnum[]
  }

  /**
   * Lobby create
   */
  export type LobbyCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyInclude<ExtArgs> | null
    /**
     * The data needed to create a Lobby.
     */
    data: XOR<LobbyCreateInput, LobbyUncheckedCreateInput>
  }

  /**
   * Lobby createMany
   */
  export type LobbyCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Lobbies.
     */
    data: LobbyCreateManyInput | LobbyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lobby createManyAndReturn
   */
  export type LobbyCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * The data used to create many Lobbies.
     */
    data: LobbyCreateManyInput | LobbyCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Lobby update
   */
  export type LobbyUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyInclude<ExtArgs> | null
    /**
     * The data needed to update a Lobby.
     */
    data: XOR<LobbyUpdateInput, LobbyUncheckedUpdateInput>
    /**
     * Choose, which Lobby to update.
     */
    where: LobbyWhereUniqueInput
  }

  /**
   * Lobby updateMany
   */
  export type LobbyUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Lobbies.
     */
    data: XOR<LobbyUpdateManyMutationInput, LobbyUncheckedUpdateManyInput>
    /**
     * Filter which Lobbies to update
     */
    where?: LobbyWhereInput
    /**
     * Limit how many Lobbies to update.
     */
    limit?: number
  }

  /**
   * Lobby updateManyAndReturn
   */
  export type LobbyUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * The data used to update Lobbies.
     */
    data: XOR<LobbyUpdateManyMutationInput, LobbyUncheckedUpdateManyInput>
    /**
     * Filter which Lobbies to update
     */
    where?: LobbyWhereInput
    /**
     * Limit how many Lobbies to update.
     */
    limit?: number
  }

  /**
   * Lobby upsert
   */
  export type LobbyUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyInclude<ExtArgs> | null
    /**
     * The filter to search for the Lobby to update in case it exists.
     */
    where: LobbyWhereUniqueInput
    /**
     * In case the Lobby found by the `where` argument doesn't exist, create a new Lobby with this data.
     */
    create: XOR<LobbyCreateInput, LobbyUncheckedCreateInput>
    /**
     * In case the Lobby was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LobbyUpdateInput, LobbyUncheckedUpdateInput>
  }

  /**
   * Lobby delete
   */
  export type LobbyDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyInclude<ExtArgs> | null
    /**
     * Filter which Lobby to delete.
     */
    where: LobbyWhereUniqueInput
  }

  /**
   * Lobby deleteMany
   */
  export type LobbyDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Lobbies to delete
     */
    where?: LobbyWhereInput
    /**
     * Limit how many Lobbies to delete.
     */
    limit?: number
  }

  /**
   * Lobby.players
   */
  export type Lobby$playersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerInclude<ExtArgs> | null
    where?: LobbyPlayerWhereInput
    orderBy?: LobbyPlayerOrderByWithRelationInput | LobbyPlayerOrderByWithRelationInput[]
    cursor?: LobbyPlayerWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LobbyPlayerScalarFieldEnum | LobbyPlayerScalarFieldEnum[]
  }

  /**
   * Lobby.chatMessages
   */
  export type Lobby$chatMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * Lobby without action
   */
  export type LobbyDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Lobby
     */
    select?: LobbySelect<ExtArgs> | null
    /**
     * Omit specific fields from the Lobby
     */
    omit?: LobbyOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyInclude<ExtArgs> | null
  }


  /**
   * Model LobbyPlayer
   */

  export type AggregateLobbyPlayer = {
    _count: LobbyPlayerCountAggregateOutputType | null
    _min: LobbyPlayerMinAggregateOutputType | null
    _max: LobbyPlayerMaxAggregateOutputType | null
  }

  export type LobbyPlayerMinAggregateOutputType = {
    id: string | null
    lobbyId: string | null
    playerAddress: string | null
    role: $Enums.PlayerRole | null
    joinedAt: Date | null
  }

  export type LobbyPlayerMaxAggregateOutputType = {
    id: string | null
    lobbyId: string | null
    playerAddress: string | null
    role: $Enums.PlayerRole | null
    joinedAt: Date | null
  }

  export type LobbyPlayerCountAggregateOutputType = {
    id: number
    lobbyId: number
    playerAddress: number
    role: number
    joinedAt: number
    _all: number
  }


  export type LobbyPlayerMinAggregateInputType = {
    id?: true
    lobbyId?: true
    playerAddress?: true
    role?: true
    joinedAt?: true
  }

  export type LobbyPlayerMaxAggregateInputType = {
    id?: true
    lobbyId?: true
    playerAddress?: true
    role?: true
    joinedAt?: true
  }

  export type LobbyPlayerCountAggregateInputType = {
    id?: true
    lobbyId?: true
    playerAddress?: true
    role?: true
    joinedAt?: true
    _all?: true
  }

  export type LobbyPlayerAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LobbyPlayer to aggregate.
     */
    where?: LobbyPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LobbyPlayers to fetch.
     */
    orderBy?: LobbyPlayerOrderByWithRelationInput | LobbyPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LobbyPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LobbyPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LobbyPlayers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LobbyPlayers
    **/
    _count?: true | LobbyPlayerCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LobbyPlayerMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LobbyPlayerMaxAggregateInputType
  }

  export type GetLobbyPlayerAggregateType<T extends LobbyPlayerAggregateArgs> = {
        [P in keyof T & keyof AggregateLobbyPlayer]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLobbyPlayer[P]>
      : GetScalarType<T[P], AggregateLobbyPlayer[P]>
  }




  export type LobbyPlayerGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LobbyPlayerWhereInput
    orderBy?: LobbyPlayerOrderByWithAggregationInput | LobbyPlayerOrderByWithAggregationInput[]
    by: LobbyPlayerScalarFieldEnum[] | LobbyPlayerScalarFieldEnum
    having?: LobbyPlayerScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LobbyPlayerCountAggregateInputType | true
    _min?: LobbyPlayerMinAggregateInputType
    _max?: LobbyPlayerMaxAggregateInputType
  }

  export type LobbyPlayerGroupByOutputType = {
    id: string
    lobbyId: string
    playerAddress: string
    role: $Enums.PlayerRole
    joinedAt: Date
    _count: LobbyPlayerCountAggregateOutputType | null
    _min: LobbyPlayerMinAggregateOutputType | null
    _max: LobbyPlayerMaxAggregateOutputType | null
  }

  type GetLobbyPlayerGroupByPayload<T extends LobbyPlayerGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LobbyPlayerGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LobbyPlayerGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LobbyPlayerGroupByOutputType[P]>
            : GetScalarType<T[P], LobbyPlayerGroupByOutputType[P]>
        }
      >
    >


  export type LobbyPlayerSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lobbyId?: boolean
    playerAddress?: boolean
    role?: boolean
    joinedAt?: boolean
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lobbyPlayer"]>

  export type LobbyPlayerSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lobbyId?: boolean
    playerAddress?: boolean
    role?: boolean
    joinedAt?: boolean
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lobbyPlayer"]>

  export type LobbyPlayerSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lobbyId?: boolean
    playerAddress?: boolean
    role?: boolean
    joinedAt?: boolean
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lobbyPlayer"]>

  export type LobbyPlayerSelectScalar = {
    id?: boolean
    lobbyId?: boolean
    playerAddress?: boolean
    role?: boolean
    joinedAt?: boolean
  }

  export type LobbyPlayerOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lobbyId" | "playerAddress" | "role" | "joinedAt", ExtArgs["result"]["lobbyPlayer"]>
  export type LobbyPlayerInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }
  export type LobbyPlayerIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }
  export type LobbyPlayerIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }

  export type $LobbyPlayerPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LobbyPlayer"
    objects: {
      lobby: Prisma.$LobbyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      lobbyId: string
      playerAddress: string
      role: $Enums.PlayerRole
      joinedAt: Date
    }, ExtArgs["result"]["lobbyPlayer"]>
    composites: {}
  }

  type LobbyPlayerGetPayload<S extends boolean | null | undefined | LobbyPlayerDefaultArgs> = $Result.GetResult<Prisma.$LobbyPlayerPayload, S>

  type LobbyPlayerCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<LobbyPlayerFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: LobbyPlayerCountAggregateInputType | true
    }

  export interface LobbyPlayerDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LobbyPlayer'], meta: { name: 'LobbyPlayer' } }
    /**
     * Find zero or one LobbyPlayer that matches the filter.
     * @param {LobbyPlayerFindUniqueArgs} args - Arguments to find a LobbyPlayer
     * @example
     * // Get one LobbyPlayer
     * const lobbyPlayer = await prisma.lobbyPlayer.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LobbyPlayerFindUniqueArgs>(args: SelectSubset<T, LobbyPlayerFindUniqueArgs<ExtArgs>>): Prisma__LobbyPlayerClient<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one LobbyPlayer that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {LobbyPlayerFindUniqueOrThrowArgs} args - Arguments to find a LobbyPlayer
     * @example
     * // Get one LobbyPlayer
     * const lobbyPlayer = await prisma.lobbyPlayer.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LobbyPlayerFindUniqueOrThrowArgs>(args: SelectSubset<T, LobbyPlayerFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LobbyPlayerClient<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LobbyPlayer that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyPlayerFindFirstArgs} args - Arguments to find a LobbyPlayer
     * @example
     * // Get one LobbyPlayer
     * const lobbyPlayer = await prisma.lobbyPlayer.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LobbyPlayerFindFirstArgs>(args?: SelectSubset<T, LobbyPlayerFindFirstArgs<ExtArgs>>): Prisma__LobbyPlayerClient<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first LobbyPlayer that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyPlayerFindFirstOrThrowArgs} args - Arguments to find a LobbyPlayer
     * @example
     * // Get one LobbyPlayer
     * const lobbyPlayer = await prisma.lobbyPlayer.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LobbyPlayerFindFirstOrThrowArgs>(args?: SelectSubset<T, LobbyPlayerFindFirstOrThrowArgs<ExtArgs>>): Prisma__LobbyPlayerClient<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more LobbyPlayers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyPlayerFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LobbyPlayers
     * const lobbyPlayers = await prisma.lobbyPlayer.findMany()
     * 
     * // Get first 10 LobbyPlayers
     * const lobbyPlayers = await prisma.lobbyPlayer.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lobbyPlayerWithIdOnly = await prisma.lobbyPlayer.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LobbyPlayerFindManyArgs>(args?: SelectSubset<T, LobbyPlayerFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a LobbyPlayer.
     * @param {LobbyPlayerCreateArgs} args - Arguments to create a LobbyPlayer.
     * @example
     * // Create one LobbyPlayer
     * const LobbyPlayer = await prisma.lobbyPlayer.create({
     *   data: {
     *     // ... data to create a LobbyPlayer
     *   }
     * })
     * 
     */
    create<T extends LobbyPlayerCreateArgs>(args: SelectSubset<T, LobbyPlayerCreateArgs<ExtArgs>>): Prisma__LobbyPlayerClient<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many LobbyPlayers.
     * @param {LobbyPlayerCreateManyArgs} args - Arguments to create many LobbyPlayers.
     * @example
     * // Create many LobbyPlayers
     * const lobbyPlayer = await prisma.lobbyPlayer.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LobbyPlayerCreateManyArgs>(args?: SelectSubset<T, LobbyPlayerCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many LobbyPlayers and returns the data saved in the database.
     * @param {LobbyPlayerCreateManyAndReturnArgs} args - Arguments to create many LobbyPlayers.
     * @example
     * // Create many LobbyPlayers
     * const lobbyPlayer = await prisma.lobbyPlayer.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many LobbyPlayers and only return the `id`
     * const lobbyPlayerWithIdOnly = await prisma.lobbyPlayer.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends LobbyPlayerCreateManyAndReturnArgs>(args?: SelectSubset<T, LobbyPlayerCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a LobbyPlayer.
     * @param {LobbyPlayerDeleteArgs} args - Arguments to delete one LobbyPlayer.
     * @example
     * // Delete one LobbyPlayer
     * const LobbyPlayer = await prisma.lobbyPlayer.delete({
     *   where: {
     *     // ... filter to delete one LobbyPlayer
     *   }
     * })
     * 
     */
    delete<T extends LobbyPlayerDeleteArgs>(args: SelectSubset<T, LobbyPlayerDeleteArgs<ExtArgs>>): Prisma__LobbyPlayerClient<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one LobbyPlayer.
     * @param {LobbyPlayerUpdateArgs} args - Arguments to update one LobbyPlayer.
     * @example
     * // Update one LobbyPlayer
     * const lobbyPlayer = await prisma.lobbyPlayer.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LobbyPlayerUpdateArgs>(args: SelectSubset<T, LobbyPlayerUpdateArgs<ExtArgs>>): Prisma__LobbyPlayerClient<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more LobbyPlayers.
     * @param {LobbyPlayerDeleteManyArgs} args - Arguments to filter LobbyPlayers to delete.
     * @example
     * // Delete a few LobbyPlayers
     * const { count } = await prisma.lobbyPlayer.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LobbyPlayerDeleteManyArgs>(args?: SelectSubset<T, LobbyPlayerDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LobbyPlayers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyPlayerUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LobbyPlayers
     * const lobbyPlayer = await prisma.lobbyPlayer.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LobbyPlayerUpdateManyArgs>(args: SelectSubset<T, LobbyPlayerUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LobbyPlayers and returns the data updated in the database.
     * @param {LobbyPlayerUpdateManyAndReturnArgs} args - Arguments to update many LobbyPlayers.
     * @example
     * // Update many LobbyPlayers
     * const lobbyPlayer = await prisma.lobbyPlayer.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more LobbyPlayers and only return the `id`
     * const lobbyPlayerWithIdOnly = await prisma.lobbyPlayer.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends LobbyPlayerUpdateManyAndReturnArgs>(args: SelectSubset<T, LobbyPlayerUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one LobbyPlayer.
     * @param {LobbyPlayerUpsertArgs} args - Arguments to update or create a LobbyPlayer.
     * @example
     * // Update or create a LobbyPlayer
     * const lobbyPlayer = await prisma.lobbyPlayer.upsert({
     *   create: {
     *     // ... data to create a LobbyPlayer
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LobbyPlayer we want to update
     *   }
     * })
     */
    upsert<T extends LobbyPlayerUpsertArgs>(args: SelectSubset<T, LobbyPlayerUpsertArgs<ExtArgs>>): Prisma__LobbyPlayerClient<$Result.GetResult<Prisma.$LobbyPlayerPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of LobbyPlayers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyPlayerCountArgs} args - Arguments to filter LobbyPlayers to count.
     * @example
     * // Count the number of LobbyPlayers
     * const count = await prisma.lobbyPlayer.count({
     *   where: {
     *     // ... the filter for the LobbyPlayers we want to count
     *   }
     * })
    **/
    count<T extends LobbyPlayerCountArgs>(
      args?: Subset<T, LobbyPlayerCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LobbyPlayerCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LobbyPlayer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyPlayerAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LobbyPlayerAggregateArgs>(args: Subset<T, LobbyPlayerAggregateArgs>): Prisma.PrismaPromise<GetLobbyPlayerAggregateType<T>>

    /**
     * Group by LobbyPlayer.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LobbyPlayerGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LobbyPlayerGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LobbyPlayerGroupByArgs['orderBy'] }
        : { orderBy?: LobbyPlayerGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LobbyPlayerGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLobbyPlayerGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LobbyPlayer model
   */
  readonly fields: LobbyPlayerFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LobbyPlayer.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LobbyPlayerClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lobby<T extends LobbyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LobbyDefaultArgs<ExtArgs>>): Prisma__LobbyClient<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LobbyPlayer model
   */
  interface LobbyPlayerFieldRefs {
    readonly id: FieldRef<"LobbyPlayer", 'String'>
    readonly lobbyId: FieldRef<"LobbyPlayer", 'String'>
    readonly playerAddress: FieldRef<"LobbyPlayer", 'String'>
    readonly role: FieldRef<"LobbyPlayer", 'PlayerRole'>
    readonly joinedAt: FieldRef<"LobbyPlayer", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LobbyPlayer findUnique
   */
  export type LobbyPlayerFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerInclude<ExtArgs> | null
    /**
     * Filter, which LobbyPlayer to fetch.
     */
    where: LobbyPlayerWhereUniqueInput
  }

  /**
   * LobbyPlayer findUniqueOrThrow
   */
  export type LobbyPlayerFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerInclude<ExtArgs> | null
    /**
     * Filter, which LobbyPlayer to fetch.
     */
    where: LobbyPlayerWhereUniqueInput
  }

  /**
   * LobbyPlayer findFirst
   */
  export type LobbyPlayerFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerInclude<ExtArgs> | null
    /**
     * Filter, which LobbyPlayer to fetch.
     */
    where?: LobbyPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LobbyPlayers to fetch.
     */
    orderBy?: LobbyPlayerOrderByWithRelationInput | LobbyPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LobbyPlayers.
     */
    cursor?: LobbyPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LobbyPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LobbyPlayers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LobbyPlayers.
     */
    distinct?: LobbyPlayerScalarFieldEnum | LobbyPlayerScalarFieldEnum[]
  }

  /**
   * LobbyPlayer findFirstOrThrow
   */
  export type LobbyPlayerFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerInclude<ExtArgs> | null
    /**
     * Filter, which LobbyPlayer to fetch.
     */
    where?: LobbyPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LobbyPlayers to fetch.
     */
    orderBy?: LobbyPlayerOrderByWithRelationInput | LobbyPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LobbyPlayers.
     */
    cursor?: LobbyPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LobbyPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LobbyPlayers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LobbyPlayers.
     */
    distinct?: LobbyPlayerScalarFieldEnum | LobbyPlayerScalarFieldEnum[]
  }

  /**
   * LobbyPlayer findMany
   */
  export type LobbyPlayerFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerInclude<ExtArgs> | null
    /**
     * Filter, which LobbyPlayers to fetch.
     */
    where?: LobbyPlayerWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LobbyPlayers to fetch.
     */
    orderBy?: LobbyPlayerOrderByWithRelationInput | LobbyPlayerOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LobbyPlayers.
     */
    cursor?: LobbyPlayerWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LobbyPlayers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LobbyPlayers.
     */
    skip?: number
    distinct?: LobbyPlayerScalarFieldEnum | LobbyPlayerScalarFieldEnum[]
  }

  /**
   * LobbyPlayer create
   */
  export type LobbyPlayerCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerInclude<ExtArgs> | null
    /**
     * The data needed to create a LobbyPlayer.
     */
    data: XOR<LobbyPlayerCreateInput, LobbyPlayerUncheckedCreateInput>
  }

  /**
   * LobbyPlayer createMany
   */
  export type LobbyPlayerCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LobbyPlayers.
     */
    data: LobbyPlayerCreateManyInput | LobbyPlayerCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * LobbyPlayer createManyAndReturn
   */
  export type LobbyPlayerCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * The data used to create many LobbyPlayers.
     */
    data: LobbyPlayerCreateManyInput | LobbyPlayerCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * LobbyPlayer update
   */
  export type LobbyPlayerUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerInclude<ExtArgs> | null
    /**
     * The data needed to update a LobbyPlayer.
     */
    data: XOR<LobbyPlayerUpdateInput, LobbyPlayerUncheckedUpdateInput>
    /**
     * Choose, which LobbyPlayer to update.
     */
    where: LobbyPlayerWhereUniqueInput
  }

  /**
   * LobbyPlayer updateMany
   */
  export type LobbyPlayerUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LobbyPlayers.
     */
    data: XOR<LobbyPlayerUpdateManyMutationInput, LobbyPlayerUncheckedUpdateManyInput>
    /**
     * Filter which LobbyPlayers to update
     */
    where?: LobbyPlayerWhereInput
    /**
     * Limit how many LobbyPlayers to update.
     */
    limit?: number
  }

  /**
   * LobbyPlayer updateManyAndReturn
   */
  export type LobbyPlayerUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * The data used to update LobbyPlayers.
     */
    data: XOR<LobbyPlayerUpdateManyMutationInput, LobbyPlayerUncheckedUpdateManyInput>
    /**
     * Filter which LobbyPlayers to update
     */
    where?: LobbyPlayerWhereInput
    /**
     * Limit how many LobbyPlayers to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * LobbyPlayer upsert
   */
  export type LobbyPlayerUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerInclude<ExtArgs> | null
    /**
     * The filter to search for the LobbyPlayer to update in case it exists.
     */
    where: LobbyPlayerWhereUniqueInput
    /**
     * In case the LobbyPlayer found by the `where` argument doesn't exist, create a new LobbyPlayer with this data.
     */
    create: XOR<LobbyPlayerCreateInput, LobbyPlayerUncheckedCreateInput>
    /**
     * In case the LobbyPlayer was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LobbyPlayerUpdateInput, LobbyPlayerUncheckedUpdateInput>
  }

  /**
   * LobbyPlayer delete
   */
  export type LobbyPlayerDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerInclude<ExtArgs> | null
    /**
     * Filter which LobbyPlayer to delete.
     */
    where: LobbyPlayerWhereUniqueInput
  }

  /**
   * LobbyPlayer deleteMany
   */
  export type LobbyPlayerDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LobbyPlayers to delete
     */
    where?: LobbyPlayerWhereInput
    /**
     * Limit how many LobbyPlayers to delete.
     */
    limit?: number
  }

  /**
   * LobbyPlayer without action
   */
  export type LobbyPlayerDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LobbyPlayer
     */
    select?: LobbyPlayerSelect<ExtArgs> | null
    /**
     * Omit specific fields from the LobbyPlayer
     */
    omit?: LobbyPlayerOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LobbyPlayerInclude<ExtArgs> | null
  }


  /**
   * Model ChatMessage
   */

  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: string | null
    lobbyId: string | null
    playerAddress: string | null
    message: string | null
    timestamp: Date | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: string | null
    lobbyId: string | null
    playerAddress: string | null
    message: string | null
    timestamp: Date | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    lobbyId: number
    playerAddress: number
    message: number
    timestamp: number
    _all: number
  }


  export type ChatMessageMinAggregateInputType = {
    id?: true
    lobbyId?: true
    playerAddress?: true
    message?: true
    timestamp?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    lobbyId?: true
    playerAddress?: true
    message?: true
    timestamp?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    lobbyId?: true
    playerAddress?: true
    message?: true
    timestamp?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithAggregationInput | ChatMessageOrderByWithAggregationInput[]
    by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }

  export type ChatMessageGroupByOutputType = {
    id: string
    lobbyId: string
    playerAddress: string
    message: string
    timestamp: Date
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lobbyId?: boolean
    playerAddress?: boolean
    message?: boolean
    timestamp?: boolean
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lobbyId?: boolean
    playerAddress?: boolean
    message?: boolean
    timestamp?: boolean
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    lobbyId?: boolean
    playerAddress?: boolean
    message?: boolean
    timestamp?: boolean
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>

  export type ChatMessageSelectScalar = {
    id?: boolean
    lobbyId?: boolean
    playerAddress?: boolean
    message?: boolean
    timestamp?: boolean
  }

  export type ChatMessageOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "lobbyId" | "playerAddress" | "message" | "timestamp", ExtArgs["result"]["chatMessage"]>
  export type ChatMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }
  export type ChatMessageIncludeUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    lobby?: boolean | LobbyDefaultArgs<ExtArgs>
  }

  export type $ChatMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMessage"
    objects: {
      lobby: Prisma.$LobbyPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      lobbyId: string
      playerAddress: string
      message: string
      timestamp: Date
    }, ExtArgs["result"]["chatMessage"]>
    composites: {}
  }

  type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = $Result.GetResult<Prisma.$ChatMessagePayload, S>

  type ChatMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'], meta: { name: 'ChatMessage' } }
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
     */
    create<T extends ChatMessageCreateArgs>(args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many ChatMessages and returns the data saved in the database.
     * @param {ChatMessageCreateManyAndReturnArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends ChatMessageCreateManyAndReturnArgs>(args?: SelectSubset<T, ChatMessageCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
     */
    delete<T extends ChatMessageDeleteArgs>(args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMessageUpdateArgs>(args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages and returns the data updated in the database.
     * @param {ChatMessageUpdateManyAndReturnArgs} args - Arguments to update many ChatMessages.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more ChatMessages and only return the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends ChatMessageUpdateManyAndReturnArgs>(args: SelectSubset<T, ChatMessageUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMessage model
   */
  readonly fields: ChatMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    lobby<T extends LobbyDefaultArgs<ExtArgs> = {}>(args?: Subset<T, LobbyDefaultArgs<ExtArgs>>): Prisma__LobbyClient<$Result.GetResult<Prisma.$LobbyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatMessage model
   */
  interface ChatMessageFieldRefs {
    readonly id: FieldRef<"ChatMessage", 'String'>
    readonly lobbyId: FieldRef<"ChatMessage", 'String'>
    readonly playerAddress: FieldRef<"ChatMessage", 'String'>
    readonly message: FieldRef<"ChatMessage", 'String'>
    readonly timestamp: FieldRef<"ChatMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatMessage findUnique
   */
  export type ChatMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findFirst
   */
  export type ChatMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }

  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ChatMessage createManyAndReturn
   */
  export type ChatMessageCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
    skipDuplicates?: boolean
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeCreateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
  }

  /**
   * ChatMessage updateManyAndReturn
   */
  export type ChatMessageUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to update.
     */
    limit?: number
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageIncludeUpdateManyAndReturn<ExtArgs> | null
  }

  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }

  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
    /**
     * Limit how many ChatMessages to delete.
     */
    limit?: number
  }

  /**
   * ChatMessage without action
   */
  export type ChatMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ChatMessage
     */
    omit?: ChatMessageOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
  }


  /**
   * Model Invitation
   */

  export type AggregateInvitation = {
    _count: InvitationCountAggregateOutputType | null
    _min: InvitationMinAggregateOutputType | null
    _max: InvitationMaxAggregateOutputType | null
  }

  export type InvitationMinAggregateOutputType = {
    id: string | null
    fromPlayerAddress: string | null
    toPlayerAddress: string | null
    lobbyCode: string | null
    timestamp: Date | null
    status: $Enums.InvitationStatus | null
  }

  export type InvitationMaxAggregateOutputType = {
    id: string | null
    fromPlayerAddress: string | null
    toPlayerAddress: string | null
    lobbyCode: string | null
    timestamp: Date | null
    status: $Enums.InvitationStatus | null
  }

  export type InvitationCountAggregateOutputType = {
    id: number
    fromPlayerAddress: number
    toPlayerAddress: number
    lobbyCode: number
    timestamp: number
    status: number
    _all: number
  }


  export type InvitationMinAggregateInputType = {
    id?: true
    fromPlayerAddress?: true
    toPlayerAddress?: true
    lobbyCode?: true
    timestamp?: true
    status?: true
  }

  export type InvitationMaxAggregateInputType = {
    id?: true
    fromPlayerAddress?: true
    toPlayerAddress?: true
    lobbyCode?: true
    timestamp?: true
    status?: true
  }

  export type InvitationCountAggregateInputType = {
    id?: true
    fromPlayerAddress?: true
    toPlayerAddress?: true
    lobbyCode?: true
    timestamp?: true
    status?: true
    _all?: true
  }

  export type InvitationAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invitation to aggregate.
     */
    where?: InvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invitations to fetch.
     */
    orderBy?: InvitationOrderByWithRelationInput | InvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: InvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Invitations
    **/
    _count?: true | InvitationCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: InvitationMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: InvitationMaxAggregateInputType
  }

  export type GetInvitationAggregateType<T extends InvitationAggregateArgs> = {
        [P in keyof T & keyof AggregateInvitation]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateInvitation[P]>
      : GetScalarType<T[P], AggregateInvitation[P]>
  }




  export type InvitationGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: InvitationWhereInput
    orderBy?: InvitationOrderByWithAggregationInput | InvitationOrderByWithAggregationInput[]
    by: InvitationScalarFieldEnum[] | InvitationScalarFieldEnum
    having?: InvitationScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: InvitationCountAggregateInputType | true
    _min?: InvitationMinAggregateInputType
    _max?: InvitationMaxAggregateInputType
  }

  export type InvitationGroupByOutputType = {
    id: string
    fromPlayerAddress: string
    toPlayerAddress: string
    lobbyCode: string
    timestamp: Date
    status: $Enums.InvitationStatus
    _count: InvitationCountAggregateOutputType | null
    _min: InvitationMinAggregateOutputType | null
    _max: InvitationMaxAggregateOutputType | null
  }

  type GetInvitationGroupByPayload<T extends InvitationGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<InvitationGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof InvitationGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], InvitationGroupByOutputType[P]>
            : GetScalarType<T[P], InvitationGroupByOutputType[P]>
        }
      >
    >


  export type InvitationSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromPlayerAddress?: boolean
    toPlayerAddress?: boolean
    lobbyCode?: boolean
    timestamp?: boolean
    status?: boolean
  }, ExtArgs["result"]["invitation"]>

  export type InvitationSelectCreateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromPlayerAddress?: boolean
    toPlayerAddress?: boolean
    lobbyCode?: boolean
    timestamp?: boolean
    status?: boolean
  }, ExtArgs["result"]["invitation"]>

  export type InvitationSelectUpdateManyAndReturn<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    fromPlayerAddress?: boolean
    toPlayerAddress?: boolean
    lobbyCode?: boolean
    timestamp?: boolean
    status?: boolean
  }, ExtArgs["result"]["invitation"]>

  export type InvitationSelectScalar = {
    id?: boolean
    fromPlayerAddress?: boolean
    toPlayerAddress?: boolean
    lobbyCode?: boolean
    timestamp?: boolean
    status?: boolean
  }

  export type InvitationOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "fromPlayerAddress" | "toPlayerAddress" | "lobbyCode" | "timestamp" | "status", ExtArgs["result"]["invitation"]>

  export type $InvitationPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Invitation"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: string
      fromPlayerAddress: string
      toPlayerAddress: string
      lobbyCode: string
      timestamp: Date
      status: $Enums.InvitationStatus
    }, ExtArgs["result"]["invitation"]>
    composites: {}
  }

  type InvitationGetPayload<S extends boolean | null | undefined | InvitationDefaultArgs> = $Result.GetResult<Prisma.$InvitationPayload, S>

  type InvitationCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<InvitationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: InvitationCountAggregateInputType | true
    }

  export interface InvitationDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Invitation'], meta: { name: 'Invitation' } }
    /**
     * Find zero or one Invitation that matches the filter.
     * @param {InvitationFindUniqueArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends InvitationFindUniqueArgs>(args: SelectSubset<T, InvitationFindUniqueArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one Invitation that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {InvitationFindUniqueOrThrowArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends InvitationFindUniqueOrThrowArgs>(args: SelectSubset<T, InvitationFindUniqueOrThrowArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invitation that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationFindFirstArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends InvitationFindFirstArgs>(args?: SelectSubset<T, InvitationFindFirstArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first Invitation that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationFindFirstOrThrowArgs} args - Arguments to find a Invitation
     * @example
     * // Get one Invitation
     * const invitation = await prisma.invitation.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends InvitationFindFirstOrThrowArgs>(args?: SelectSubset<T, InvitationFindFirstOrThrowArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more Invitations that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Invitations
     * const invitations = await prisma.invitation.findMany()
     * 
     * // Get first 10 Invitations
     * const invitations = await prisma.invitation.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const invitationWithIdOnly = await prisma.invitation.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends InvitationFindManyArgs>(args?: SelectSubset<T, InvitationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a Invitation.
     * @param {InvitationCreateArgs} args - Arguments to create a Invitation.
     * @example
     * // Create one Invitation
     * const Invitation = await prisma.invitation.create({
     *   data: {
     *     // ... data to create a Invitation
     *   }
     * })
     * 
     */
    create<T extends InvitationCreateArgs>(args: SelectSubset<T, InvitationCreateArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many Invitations.
     * @param {InvitationCreateManyArgs} args - Arguments to create many Invitations.
     * @example
     * // Create many Invitations
     * const invitation = await prisma.invitation.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends InvitationCreateManyArgs>(args?: SelectSubset<T, InvitationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create many Invitations and returns the data saved in the database.
     * @param {InvitationCreateManyAndReturnArgs} args - Arguments to create many Invitations.
     * @example
     * // Create many Invitations
     * const invitation = await prisma.invitation.createManyAndReturn({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Create many Invitations and only return the `id`
     * const invitationWithIdOnly = await prisma.invitation.createManyAndReturn({
     *   select: { id: true },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    createManyAndReturn<T extends InvitationCreateManyAndReturnArgs>(args?: SelectSubset<T, InvitationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>

    /**
     * Delete a Invitation.
     * @param {InvitationDeleteArgs} args - Arguments to delete one Invitation.
     * @example
     * // Delete one Invitation
     * const Invitation = await prisma.invitation.delete({
     *   where: {
     *     // ... filter to delete one Invitation
     *   }
     * })
     * 
     */
    delete<T extends InvitationDeleteArgs>(args: SelectSubset<T, InvitationDeleteArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one Invitation.
     * @param {InvitationUpdateArgs} args - Arguments to update one Invitation.
     * @example
     * // Update one Invitation
     * const invitation = await prisma.invitation.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends InvitationUpdateArgs>(args: SelectSubset<T, InvitationUpdateArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more Invitations.
     * @param {InvitationDeleteManyArgs} args - Arguments to filter Invitations to delete.
     * @example
     * // Delete a few Invitations
     * const { count } = await prisma.invitation.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends InvitationDeleteManyArgs>(args?: SelectSubset<T, InvitationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Invitations
     * const invitation = await prisma.invitation.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends InvitationUpdateManyArgs>(args: SelectSubset<T, InvitationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Invitations and returns the data updated in the database.
     * @param {InvitationUpdateManyAndReturnArgs} args - Arguments to update many Invitations.
     * @example
     * // Update many Invitations
     * const invitation = await prisma.invitation.updateManyAndReturn({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * 
     * // Update zero or more Invitations and only return the `id`
     * const invitationWithIdOnly = await prisma.invitation.updateManyAndReturn({
     *   select: { id: true },
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * 
     */
    updateManyAndReturn<T extends InvitationUpdateManyAndReturnArgs>(args: SelectSubset<T, InvitationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>

    /**
     * Create or update one Invitation.
     * @param {InvitationUpsertArgs} args - Arguments to update or create a Invitation.
     * @example
     * // Update or create a Invitation
     * const invitation = await prisma.invitation.upsert({
     *   create: {
     *     // ... data to create a Invitation
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Invitation we want to update
     *   }
     * })
     */
    upsert<T extends InvitationUpsertArgs>(args: SelectSubset<T, InvitationUpsertArgs<ExtArgs>>): Prisma__InvitationClient<$Result.GetResult<Prisma.$InvitationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of Invitations.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationCountArgs} args - Arguments to filter Invitations to count.
     * @example
     * // Count the number of Invitations
     * const count = await prisma.invitation.count({
     *   where: {
     *     // ... the filter for the Invitations we want to count
     *   }
     * })
    **/
    count<T extends InvitationCountArgs>(
      args?: Subset<T, InvitationCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], InvitationCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Invitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends InvitationAggregateArgs>(args: Subset<T, InvitationAggregateArgs>): Prisma.PrismaPromise<GetInvitationAggregateType<T>>

    /**
     * Group by Invitation.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {InvitationGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends InvitationGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: InvitationGroupByArgs['orderBy'] }
        : { orderBy?: InvitationGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, InvitationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetInvitationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Invitation model
   */
  readonly fields: InvitationFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Invitation.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__InvitationClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Invitation model
   */
  interface InvitationFieldRefs {
    readonly id: FieldRef<"Invitation", 'String'>
    readonly fromPlayerAddress: FieldRef<"Invitation", 'String'>
    readonly toPlayerAddress: FieldRef<"Invitation", 'String'>
    readonly lobbyCode: FieldRef<"Invitation", 'String'>
    readonly timestamp: FieldRef<"Invitation", 'DateTime'>
    readonly status: FieldRef<"Invitation", 'InvitationStatus'>
  }
    

  // Custom InputTypes
  /**
   * Invitation findUnique
   */
  export type InvitationFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Filter, which Invitation to fetch.
     */
    where: InvitationWhereUniqueInput
  }

  /**
   * Invitation findUniqueOrThrow
   */
  export type InvitationFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Filter, which Invitation to fetch.
     */
    where: InvitationWhereUniqueInput
  }

  /**
   * Invitation findFirst
   */
  export type InvitationFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Filter, which Invitation to fetch.
     */
    where?: InvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invitations to fetch.
     */
    orderBy?: InvitationOrderByWithRelationInput | InvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invitations.
     */
    cursor?: InvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invitations.
     */
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[]
  }

  /**
   * Invitation findFirstOrThrow
   */
  export type InvitationFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Filter, which Invitation to fetch.
     */
    where?: InvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invitations to fetch.
     */
    orderBy?: InvitationOrderByWithRelationInput | InvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Invitations.
     */
    cursor?: InvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invitations.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Invitations.
     */
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[]
  }

  /**
   * Invitation findMany
   */
  export type InvitationFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Filter, which Invitations to fetch.
     */
    where?: InvitationWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Invitations to fetch.
     */
    orderBy?: InvitationOrderByWithRelationInput | InvitationOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Invitations.
     */
    cursor?: InvitationWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Invitations from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Invitations.
     */
    skip?: number
    distinct?: InvitationScalarFieldEnum | InvitationScalarFieldEnum[]
  }

  /**
   * Invitation create
   */
  export type InvitationCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * The data needed to create a Invitation.
     */
    data: XOR<InvitationCreateInput, InvitationUncheckedCreateInput>
  }

  /**
   * Invitation createMany
   */
  export type InvitationCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Invitations.
     */
    data: InvitationCreateManyInput | InvitationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invitation createManyAndReturn
   */
  export type InvitationCreateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelectCreateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * The data used to create many Invitations.
     */
    data: InvitationCreateManyInput | InvitationCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * Invitation update
   */
  export type InvitationUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * The data needed to update a Invitation.
     */
    data: XOR<InvitationUpdateInput, InvitationUncheckedUpdateInput>
    /**
     * Choose, which Invitation to update.
     */
    where: InvitationWhereUniqueInput
  }

  /**
   * Invitation updateMany
   */
  export type InvitationUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Invitations.
     */
    data: XOR<InvitationUpdateManyMutationInput, InvitationUncheckedUpdateManyInput>
    /**
     * Filter which Invitations to update
     */
    where?: InvitationWhereInput
    /**
     * Limit how many Invitations to update.
     */
    limit?: number
  }

  /**
   * Invitation updateManyAndReturn
   */
  export type InvitationUpdateManyAndReturnArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelectUpdateManyAndReturn<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * The data used to update Invitations.
     */
    data: XOR<InvitationUpdateManyMutationInput, InvitationUncheckedUpdateManyInput>
    /**
     * Filter which Invitations to update
     */
    where?: InvitationWhereInput
    /**
     * Limit how many Invitations to update.
     */
    limit?: number
  }

  /**
   * Invitation upsert
   */
  export type InvitationUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * The filter to search for the Invitation to update in case it exists.
     */
    where: InvitationWhereUniqueInput
    /**
     * In case the Invitation found by the `where` argument doesn't exist, create a new Invitation with this data.
     */
    create: XOR<InvitationCreateInput, InvitationUncheckedCreateInput>
    /**
     * In case the Invitation was found with the provided `where` argument, update it with this data.
     */
    update: XOR<InvitationUpdateInput, InvitationUncheckedUpdateInput>
  }

  /**
   * Invitation delete
   */
  export type InvitationDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
    /**
     * Filter which Invitation to delete.
     */
    where: InvitationWhereUniqueInput
  }

  /**
   * Invitation deleteMany
   */
  export type InvitationDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Invitations to delete
     */
    where?: InvitationWhereInput
    /**
     * Limit how many Invitations to delete.
     */
    limit?: number
  }

  /**
   * Invitation without action
   */
  export type InvitationDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Invitation
     */
    select?: InvitationSelect<ExtArgs> | null
    /**
     * Omit specific fields from the Invitation
     */
    omit?: InvitationOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const LobbyScalarFieldEnum: {
    id: 'id',
    code: 'code',
    hostAddress: 'hostAddress',
    status: 'status',
    created: 'created',
    lastActivity: 'lastActivity',
    currentMatch: 'currentMatch'
  };

  export type LobbyScalarFieldEnum = (typeof LobbyScalarFieldEnum)[keyof typeof LobbyScalarFieldEnum]


  export const LobbyPlayerScalarFieldEnum: {
    id: 'id',
    lobbyId: 'lobbyId',
    playerAddress: 'playerAddress',
    role: 'role',
    joinedAt: 'joinedAt'
  };

  export type LobbyPlayerScalarFieldEnum = (typeof LobbyPlayerScalarFieldEnum)[keyof typeof LobbyPlayerScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    lobbyId: 'lobbyId',
    playerAddress: 'playerAddress',
    message: 'message',
    timestamp: 'timestamp'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const InvitationScalarFieldEnum: {
    id: 'id',
    fromPlayerAddress: 'fromPlayerAddress',
    toPlayerAddress: 'toPlayerAddress',
    lobbyCode: 'lobbyCode',
    timestamp: 'timestamp',
    status: 'status'
  };

  export type InvitationScalarFieldEnum = (typeof InvitationScalarFieldEnum)[keyof typeof InvitationScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'LobbyStatus'
   */
  export type EnumLobbyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LobbyStatus'>
    


  /**
   * Reference to a field of type 'LobbyStatus[]'
   */
  export type ListEnumLobbyStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'LobbyStatus[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'PlayerRole'
   */
  export type EnumPlayerRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlayerRole'>
    


  /**
   * Reference to a field of type 'PlayerRole[]'
   */
  export type ListEnumPlayerRoleFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'PlayerRole[]'>
    


  /**
   * Reference to a field of type 'InvitationStatus'
   */
  export type EnumInvitationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvitationStatus'>
    


  /**
   * Reference to a field of type 'InvitationStatus[]'
   */
  export type ListEnumInvitationStatusFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'InvitationStatus[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    
  /**
   * Deep Input Types
   */


  export type LobbyWhereInput = {
    AND?: LobbyWhereInput | LobbyWhereInput[]
    OR?: LobbyWhereInput[]
    NOT?: LobbyWhereInput | LobbyWhereInput[]
    id?: StringFilter<"Lobby"> | string
    code?: StringFilter<"Lobby"> | string
    hostAddress?: StringFilter<"Lobby"> | string
    status?: EnumLobbyStatusFilter<"Lobby"> | $Enums.LobbyStatus
    created?: DateTimeFilter<"Lobby"> | Date | string
    lastActivity?: DateTimeFilter<"Lobby"> | Date | string
    currentMatch?: StringNullableFilter<"Lobby"> | string | null
    players?: LobbyPlayerListRelationFilter
    chatMessages?: ChatMessageListRelationFilter
  }

  export type LobbyOrderByWithRelationInput = {
    id?: SortOrder
    code?: SortOrder
    hostAddress?: SortOrder
    status?: SortOrder
    created?: SortOrder
    lastActivity?: SortOrder
    currentMatch?: SortOrderInput | SortOrder
    players?: LobbyPlayerOrderByRelationAggregateInput
    chatMessages?: ChatMessageOrderByRelationAggregateInput
  }

  export type LobbyWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    code?: string
    AND?: LobbyWhereInput | LobbyWhereInput[]
    OR?: LobbyWhereInput[]
    NOT?: LobbyWhereInput | LobbyWhereInput[]
    hostAddress?: StringFilter<"Lobby"> | string
    status?: EnumLobbyStatusFilter<"Lobby"> | $Enums.LobbyStatus
    created?: DateTimeFilter<"Lobby"> | Date | string
    lastActivity?: DateTimeFilter<"Lobby"> | Date | string
    currentMatch?: StringNullableFilter<"Lobby"> | string | null
    players?: LobbyPlayerListRelationFilter
    chatMessages?: ChatMessageListRelationFilter
  }, "id" | "code">

  export type LobbyOrderByWithAggregationInput = {
    id?: SortOrder
    code?: SortOrder
    hostAddress?: SortOrder
    status?: SortOrder
    created?: SortOrder
    lastActivity?: SortOrder
    currentMatch?: SortOrderInput | SortOrder
    _count?: LobbyCountOrderByAggregateInput
    _max?: LobbyMaxOrderByAggregateInput
    _min?: LobbyMinOrderByAggregateInput
  }

  export type LobbyScalarWhereWithAggregatesInput = {
    AND?: LobbyScalarWhereWithAggregatesInput | LobbyScalarWhereWithAggregatesInput[]
    OR?: LobbyScalarWhereWithAggregatesInput[]
    NOT?: LobbyScalarWhereWithAggregatesInput | LobbyScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Lobby"> | string
    code?: StringWithAggregatesFilter<"Lobby"> | string
    hostAddress?: StringWithAggregatesFilter<"Lobby"> | string
    status?: EnumLobbyStatusWithAggregatesFilter<"Lobby"> | $Enums.LobbyStatus
    created?: DateTimeWithAggregatesFilter<"Lobby"> | Date | string
    lastActivity?: DateTimeWithAggregatesFilter<"Lobby"> | Date | string
    currentMatch?: StringNullableWithAggregatesFilter<"Lobby"> | string | null
  }

  export type LobbyPlayerWhereInput = {
    AND?: LobbyPlayerWhereInput | LobbyPlayerWhereInput[]
    OR?: LobbyPlayerWhereInput[]
    NOT?: LobbyPlayerWhereInput | LobbyPlayerWhereInput[]
    id?: StringFilter<"LobbyPlayer"> | string
    lobbyId?: StringFilter<"LobbyPlayer"> | string
    playerAddress?: StringFilter<"LobbyPlayer"> | string
    role?: EnumPlayerRoleFilter<"LobbyPlayer"> | $Enums.PlayerRole
    joinedAt?: DateTimeFilter<"LobbyPlayer"> | Date | string
    lobby?: XOR<LobbyScalarRelationFilter, LobbyWhereInput>
  }

  export type LobbyPlayerOrderByWithRelationInput = {
    id?: SortOrder
    lobbyId?: SortOrder
    playerAddress?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    lobby?: LobbyOrderByWithRelationInput
  }

  export type LobbyPlayerWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LobbyPlayerWhereInput | LobbyPlayerWhereInput[]
    OR?: LobbyPlayerWhereInput[]
    NOT?: LobbyPlayerWhereInput | LobbyPlayerWhereInput[]
    lobbyId?: StringFilter<"LobbyPlayer"> | string
    playerAddress?: StringFilter<"LobbyPlayer"> | string
    role?: EnumPlayerRoleFilter<"LobbyPlayer"> | $Enums.PlayerRole
    joinedAt?: DateTimeFilter<"LobbyPlayer"> | Date | string
    lobby?: XOR<LobbyScalarRelationFilter, LobbyWhereInput>
  }, "id">

  export type LobbyPlayerOrderByWithAggregationInput = {
    id?: SortOrder
    lobbyId?: SortOrder
    playerAddress?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
    _count?: LobbyPlayerCountOrderByAggregateInput
    _max?: LobbyPlayerMaxOrderByAggregateInput
    _min?: LobbyPlayerMinOrderByAggregateInput
  }

  export type LobbyPlayerScalarWhereWithAggregatesInput = {
    AND?: LobbyPlayerScalarWhereWithAggregatesInput | LobbyPlayerScalarWhereWithAggregatesInput[]
    OR?: LobbyPlayerScalarWhereWithAggregatesInput[]
    NOT?: LobbyPlayerScalarWhereWithAggregatesInput | LobbyPlayerScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LobbyPlayer"> | string
    lobbyId?: StringWithAggregatesFilter<"LobbyPlayer"> | string
    playerAddress?: StringWithAggregatesFilter<"LobbyPlayer"> | string
    role?: EnumPlayerRoleWithAggregatesFilter<"LobbyPlayer"> | $Enums.PlayerRole
    joinedAt?: DateTimeWithAggregatesFilter<"LobbyPlayer"> | Date | string
  }

  export type ChatMessageWhereInput = {
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    lobbyId?: StringFilter<"ChatMessage"> | string
    playerAddress?: StringFilter<"ChatMessage"> | string
    message?: StringFilter<"ChatMessage"> | string
    timestamp?: DateTimeFilter<"ChatMessage"> | Date | string
    lobby?: XOR<LobbyScalarRelationFilter, LobbyWhereInput>
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    lobbyId?: SortOrder
    playerAddress?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
    lobby?: LobbyOrderByWithRelationInput
  }

  export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    lobbyId?: StringFilter<"ChatMessage"> | string
    playerAddress?: StringFilter<"ChatMessage"> | string
    message?: StringFilter<"ChatMessage"> | string
    timestamp?: DateTimeFilter<"ChatMessage"> | Date | string
    lobby?: XOR<LobbyScalarRelationFilter, LobbyWhereInput>
  }, "id">

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    lobbyId?: SortOrder
    playerAddress?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    OR?: ChatMessageScalarWhereWithAggregatesInput[]
    NOT?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatMessage"> | string
    lobbyId?: StringWithAggregatesFilter<"ChatMessage"> | string
    playerAddress?: StringWithAggregatesFilter<"ChatMessage"> | string
    message?: StringWithAggregatesFilter<"ChatMessage"> | string
    timestamp?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string
  }

  export type InvitationWhereInput = {
    AND?: InvitationWhereInput | InvitationWhereInput[]
    OR?: InvitationWhereInput[]
    NOT?: InvitationWhereInput | InvitationWhereInput[]
    id?: StringFilter<"Invitation"> | string
    fromPlayerAddress?: StringFilter<"Invitation"> | string
    toPlayerAddress?: StringFilter<"Invitation"> | string
    lobbyCode?: StringFilter<"Invitation"> | string
    timestamp?: DateTimeFilter<"Invitation"> | Date | string
    status?: EnumInvitationStatusFilter<"Invitation"> | $Enums.InvitationStatus
  }

  export type InvitationOrderByWithRelationInput = {
    id?: SortOrder
    fromPlayerAddress?: SortOrder
    toPlayerAddress?: SortOrder
    lobbyCode?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
  }

  export type InvitationWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: InvitationWhereInput | InvitationWhereInput[]
    OR?: InvitationWhereInput[]
    NOT?: InvitationWhereInput | InvitationWhereInput[]
    fromPlayerAddress?: StringFilter<"Invitation"> | string
    toPlayerAddress?: StringFilter<"Invitation"> | string
    lobbyCode?: StringFilter<"Invitation"> | string
    timestamp?: DateTimeFilter<"Invitation"> | Date | string
    status?: EnumInvitationStatusFilter<"Invitation"> | $Enums.InvitationStatus
  }, "id">

  export type InvitationOrderByWithAggregationInput = {
    id?: SortOrder
    fromPlayerAddress?: SortOrder
    toPlayerAddress?: SortOrder
    lobbyCode?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
    _count?: InvitationCountOrderByAggregateInput
    _max?: InvitationMaxOrderByAggregateInput
    _min?: InvitationMinOrderByAggregateInput
  }

  export type InvitationScalarWhereWithAggregatesInput = {
    AND?: InvitationScalarWhereWithAggregatesInput | InvitationScalarWhereWithAggregatesInput[]
    OR?: InvitationScalarWhereWithAggregatesInput[]
    NOT?: InvitationScalarWhereWithAggregatesInput | InvitationScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Invitation"> | string
    fromPlayerAddress?: StringWithAggregatesFilter<"Invitation"> | string
    toPlayerAddress?: StringWithAggregatesFilter<"Invitation"> | string
    lobbyCode?: StringWithAggregatesFilter<"Invitation"> | string
    timestamp?: DateTimeWithAggregatesFilter<"Invitation"> | Date | string
    status?: EnumInvitationStatusWithAggregatesFilter<"Invitation"> | $Enums.InvitationStatus
  }

  export type LobbyCreateInput = {
    id?: string
    code: string
    hostAddress: string
    status?: $Enums.LobbyStatus
    created?: Date | string
    lastActivity?: Date | string
    currentMatch?: string | null
    players?: LobbyPlayerCreateNestedManyWithoutLobbyInput
    chatMessages?: ChatMessageCreateNestedManyWithoutLobbyInput
  }

  export type LobbyUncheckedCreateInput = {
    id?: string
    code: string
    hostAddress: string
    status?: $Enums.LobbyStatus
    created?: Date | string
    lastActivity?: Date | string
    currentMatch?: string | null
    players?: LobbyPlayerUncheckedCreateNestedManyWithoutLobbyInput
    chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutLobbyInput
  }

  export type LobbyUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    hostAddress?: StringFieldUpdateOperationsInput | string
    status?: EnumLobbyStatusFieldUpdateOperationsInput | $Enums.LobbyStatus
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    currentMatch?: NullableStringFieldUpdateOperationsInput | string | null
    players?: LobbyPlayerUpdateManyWithoutLobbyNestedInput
    chatMessages?: ChatMessageUpdateManyWithoutLobbyNestedInput
  }

  export type LobbyUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    hostAddress?: StringFieldUpdateOperationsInput | string
    status?: EnumLobbyStatusFieldUpdateOperationsInput | $Enums.LobbyStatus
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    currentMatch?: NullableStringFieldUpdateOperationsInput | string | null
    players?: LobbyPlayerUncheckedUpdateManyWithoutLobbyNestedInput
    chatMessages?: ChatMessageUncheckedUpdateManyWithoutLobbyNestedInput
  }

  export type LobbyCreateManyInput = {
    id?: string
    code: string
    hostAddress: string
    status?: $Enums.LobbyStatus
    created?: Date | string
    lastActivity?: Date | string
    currentMatch?: string | null
  }

  export type LobbyUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    hostAddress?: StringFieldUpdateOperationsInput | string
    status?: EnumLobbyStatusFieldUpdateOperationsInput | $Enums.LobbyStatus
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    currentMatch?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LobbyUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    hostAddress?: StringFieldUpdateOperationsInput | string
    status?: EnumLobbyStatusFieldUpdateOperationsInput | $Enums.LobbyStatus
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    currentMatch?: NullableStringFieldUpdateOperationsInput | string | null
  }

  export type LobbyPlayerCreateInput = {
    id?: string
    playerAddress: string
    role: $Enums.PlayerRole
    joinedAt?: Date | string
    lobby: LobbyCreateNestedOneWithoutPlayersInput
  }

  export type LobbyPlayerUncheckedCreateInput = {
    id?: string
    lobbyId: string
    playerAddress: string
    role: $Enums.PlayerRole
    joinedAt?: Date | string
  }

  export type LobbyPlayerUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    lobby?: LobbyUpdateOneRequiredWithoutPlayersNestedInput
  }

  export type LobbyPlayerUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lobbyId?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LobbyPlayerCreateManyInput = {
    id?: string
    lobbyId: string
    playerAddress: string
    role: $Enums.PlayerRole
    joinedAt?: Date | string
  }

  export type LobbyPlayerUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LobbyPlayerUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    lobbyId?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateInput = {
    id?: string
    playerAddress: string
    message: string
    timestamp?: Date | string
    lobby: LobbyCreateNestedOneWithoutChatMessagesInput
  }

  export type ChatMessageUncheckedCreateInput = {
    id?: string
    lobbyId: string
    playerAddress: string
    message: string
    timestamp?: Date | string
  }

  export type ChatMessageUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    lobby?: LobbyUpdateOneRequiredWithoutChatMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    lobbyId?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManyInput = {
    id?: string
    lobbyId: string
    playerAddress: string
    message: string
    timestamp?: Date | string
  }

  export type ChatMessageUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    lobbyId?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type InvitationCreateInput = {
    id?: string
    fromPlayerAddress: string
    toPlayerAddress: string
    lobbyCode: string
    timestamp?: Date | string
    status?: $Enums.InvitationStatus
  }

  export type InvitationUncheckedCreateInput = {
    id?: string
    fromPlayerAddress: string
    toPlayerAddress: string
    lobbyCode: string
    timestamp?: Date | string
    status?: $Enums.InvitationStatus
  }

  export type InvitationUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromPlayerAddress?: StringFieldUpdateOperationsInput | string
    toPlayerAddress?: StringFieldUpdateOperationsInput | string
    lobbyCode?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
  }

  export type InvitationUncheckedUpdateInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromPlayerAddress?: StringFieldUpdateOperationsInput | string
    toPlayerAddress?: StringFieldUpdateOperationsInput | string
    lobbyCode?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
  }

  export type InvitationCreateManyInput = {
    id?: string
    fromPlayerAddress: string
    toPlayerAddress: string
    lobbyCode: string
    timestamp?: Date | string
    status?: $Enums.InvitationStatus
  }

  export type InvitationUpdateManyMutationInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromPlayerAddress?: StringFieldUpdateOperationsInput | string
    toPlayerAddress?: StringFieldUpdateOperationsInput | string
    lobbyCode?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
  }

  export type InvitationUncheckedUpdateManyInput = {
    id?: StringFieldUpdateOperationsInput | string
    fromPlayerAddress?: StringFieldUpdateOperationsInput | string
    toPlayerAddress?: StringFieldUpdateOperationsInput | string
    lobbyCode?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    status?: EnumInvitationStatusFieldUpdateOperationsInput | $Enums.InvitationStatus
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type EnumLobbyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LobbyStatus | EnumLobbyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LobbyStatus[] | ListEnumLobbyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LobbyStatus[] | ListEnumLobbyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLobbyStatusFilter<$PrismaModel> | $Enums.LobbyStatus
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type LobbyPlayerListRelationFilter = {
    every?: LobbyPlayerWhereInput
    some?: LobbyPlayerWhereInput
    none?: LobbyPlayerWhereInput
  }

  export type ChatMessageListRelationFilter = {
    every?: ChatMessageWhereInput
    some?: ChatMessageWhereInput
    none?: ChatMessageWhereInput
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type LobbyPlayerOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LobbyCountOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    hostAddress?: SortOrder
    status?: SortOrder
    created?: SortOrder
    lastActivity?: SortOrder
    currentMatch?: SortOrder
  }

  export type LobbyMaxOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    hostAddress?: SortOrder
    status?: SortOrder
    created?: SortOrder
    lastActivity?: SortOrder
    currentMatch?: SortOrder
  }

  export type LobbyMinOrderByAggregateInput = {
    id?: SortOrder
    code?: SortOrder
    hostAddress?: SortOrder
    status?: SortOrder
    created?: SortOrder
    lastActivity?: SortOrder
    currentMatch?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type EnumLobbyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LobbyStatus | EnumLobbyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LobbyStatus[] | ListEnumLobbyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LobbyStatus[] | ListEnumLobbyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLobbyStatusWithAggregatesFilter<$PrismaModel> | $Enums.LobbyStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLobbyStatusFilter<$PrismaModel>
    _max?: NestedEnumLobbyStatusFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type EnumPlayerRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | EnumPlayerRoleFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerRoleFilter<$PrismaModel> | $Enums.PlayerRole
  }

  export type LobbyScalarRelationFilter = {
    is?: LobbyWhereInput
    isNot?: LobbyWhereInput
  }

  export type LobbyPlayerCountOrderByAggregateInput = {
    id?: SortOrder
    lobbyId?: SortOrder
    playerAddress?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type LobbyPlayerMaxOrderByAggregateInput = {
    id?: SortOrder
    lobbyId?: SortOrder
    playerAddress?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type LobbyPlayerMinOrderByAggregateInput = {
    id?: SortOrder
    lobbyId?: SortOrder
    playerAddress?: SortOrder
    role?: SortOrder
    joinedAt?: SortOrder
  }

  export type EnumPlayerRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | EnumPlayerRoleFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerRoleWithAggregatesFilter<$PrismaModel> | $Enums.PlayerRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlayerRoleFilter<$PrismaModel>
    _max?: NestedEnumPlayerRoleFilter<$PrismaModel>
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    lobbyId?: SortOrder
    playerAddress?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    lobbyId?: SortOrder
    playerAddress?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    lobbyId?: SortOrder
    playerAddress?: SortOrder
    message?: SortOrder
    timestamp?: SortOrder
  }

  export type EnumInvitationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvitationStatus | EnumInvitationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvitationStatus[] | ListEnumInvitationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvitationStatus[] | ListEnumInvitationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvitationStatusFilter<$PrismaModel> | $Enums.InvitationStatus
  }

  export type InvitationCountOrderByAggregateInput = {
    id?: SortOrder
    fromPlayerAddress?: SortOrder
    toPlayerAddress?: SortOrder
    lobbyCode?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
  }

  export type InvitationMaxOrderByAggregateInput = {
    id?: SortOrder
    fromPlayerAddress?: SortOrder
    toPlayerAddress?: SortOrder
    lobbyCode?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
  }

  export type InvitationMinOrderByAggregateInput = {
    id?: SortOrder
    fromPlayerAddress?: SortOrder
    toPlayerAddress?: SortOrder
    lobbyCode?: SortOrder
    timestamp?: SortOrder
    status?: SortOrder
  }

  export type EnumInvitationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvitationStatus | EnumInvitationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvitationStatus[] | ListEnumInvitationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvitationStatus[] | ListEnumInvitationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvitationStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvitationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvitationStatusFilter<$PrismaModel>
    _max?: NestedEnumInvitationStatusFilter<$PrismaModel>
  }

  export type LobbyPlayerCreateNestedManyWithoutLobbyInput = {
    create?: XOR<LobbyPlayerCreateWithoutLobbyInput, LobbyPlayerUncheckedCreateWithoutLobbyInput> | LobbyPlayerCreateWithoutLobbyInput[] | LobbyPlayerUncheckedCreateWithoutLobbyInput[]
    connectOrCreate?: LobbyPlayerCreateOrConnectWithoutLobbyInput | LobbyPlayerCreateOrConnectWithoutLobbyInput[]
    createMany?: LobbyPlayerCreateManyLobbyInputEnvelope
    connect?: LobbyPlayerWhereUniqueInput | LobbyPlayerWhereUniqueInput[]
  }

  export type ChatMessageCreateNestedManyWithoutLobbyInput = {
    create?: XOR<ChatMessageCreateWithoutLobbyInput, ChatMessageUncheckedCreateWithoutLobbyInput> | ChatMessageCreateWithoutLobbyInput[] | ChatMessageUncheckedCreateWithoutLobbyInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutLobbyInput | ChatMessageCreateOrConnectWithoutLobbyInput[]
    createMany?: ChatMessageCreateManyLobbyInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type LobbyPlayerUncheckedCreateNestedManyWithoutLobbyInput = {
    create?: XOR<LobbyPlayerCreateWithoutLobbyInput, LobbyPlayerUncheckedCreateWithoutLobbyInput> | LobbyPlayerCreateWithoutLobbyInput[] | LobbyPlayerUncheckedCreateWithoutLobbyInput[]
    connectOrCreate?: LobbyPlayerCreateOrConnectWithoutLobbyInput | LobbyPlayerCreateOrConnectWithoutLobbyInput[]
    createMany?: LobbyPlayerCreateManyLobbyInputEnvelope
    connect?: LobbyPlayerWhereUniqueInput | LobbyPlayerWhereUniqueInput[]
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutLobbyInput = {
    create?: XOR<ChatMessageCreateWithoutLobbyInput, ChatMessageUncheckedCreateWithoutLobbyInput> | ChatMessageCreateWithoutLobbyInput[] | ChatMessageUncheckedCreateWithoutLobbyInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutLobbyInput | ChatMessageCreateOrConnectWithoutLobbyInput[]
    createMany?: ChatMessageCreateManyLobbyInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type EnumLobbyStatusFieldUpdateOperationsInput = {
    set?: $Enums.LobbyStatus
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type LobbyPlayerUpdateManyWithoutLobbyNestedInput = {
    create?: XOR<LobbyPlayerCreateWithoutLobbyInput, LobbyPlayerUncheckedCreateWithoutLobbyInput> | LobbyPlayerCreateWithoutLobbyInput[] | LobbyPlayerUncheckedCreateWithoutLobbyInput[]
    connectOrCreate?: LobbyPlayerCreateOrConnectWithoutLobbyInput | LobbyPlayerCreateOrConnectWithoutLobbyInput[]
    upsert?: LobbyPlayerUpsertWithWhereUniqueWithoutLobbyInput | LobbyPlayerUpsertWithWhereUniqueWithoutLobbyInput[]
    createMany?: LobbyPlayerCreateManyLobbyInputEnvelope
    set?: LobbyPlayerWhereUniqueInput | LobbyPlayerWhereUniqueInput[]
    disconnect?: LobbyPlayerWhereUniqueInput | LobbyPlayerWhereUniqueInput[]
    delete?: LobbyPlayerWhereUniqueInput | LobbyPlayerWhereUniqueInput[]
    connect?: LobbyPlayerWhereUniqueInput | LobbyPlayerWhereUniqueInput[]
    update?: LobbyPlayerUpdateWithWhereUniqueWithoutLobbyInput | LobbyPlayerUpdateWithWhereUniqueWithoutLobbyInput[]
    updateMany?: LobbyPlayerUpdateManyWithWhereWithoutLobbyInput | LobbyPlayerUpdateManyWithWhereWithoutLobbyInput[]
    deleteMany?: LobbyPlayerScalarWhereInput | LobbyPlayerScalarWhereInput[]
  }

  export type ChatMessageUpdateManyWithoutLobbyNestedInput = {
    create?: XOR<ChatMessageCreateWithoutLobbyInput, ChatMessageUncheckedCreateWithoutLobbyInput> | ChatMessageCreateWithoutLobbyInput[] | ChatMessageUncheckedCreateWithoutLobbyInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutLobbyInput | ChatMessageCreateOrConnectWithoutLobbyInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutLobbyInput | ChatMessageUpsertWithWhereUniqueWithoutLobbyInput[]
    createMany?: ChatMessageCreateManyLobbyInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutLobbyInput | ChatMessageUpdateWithWhereUniqueWithoutLobbyInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutLobbyInput | ChatMessageUpdateManyWithWhereWithoutLobbyInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type LobbyPlayerUncheckedUpdateManyWithoutLobbyNestedInput = {
    create?: XOR<LobbyPlayerCreateWithoutLobbyInput, LobbyPlayerUncheckedCreateWithoutLobbyInput> | LobbyPlayerCreateWithoutLobbyInput[] | LobbyPlayerUncheckedCreateWithoutLobbyInput[]
    connectOrCreate?: LobbyPlayerCreateOrConnectWithoutLobbyInput | LobbyPlayerCreateOrConnectWithoutLobbyInput[]
    upsert?: LobbyPlayerUpsertWithWhereUniqueWithoutLobbyInput | LobbyPlayerUpsertWithWhereUniqueWithoutLobbyInput[]
    createMany?: LobbyPlayerCreateManyLobbyInputEnvelope
    set?: LobbyPlayerWhereUniqueInput | LobbyPlayerWhereUniqueInput[]
    disconnect?: LobbyPlayerWhereUniqueInput | LobbyPlayerWhereUniqueInput[]
    delete?: LobbyPlayerWhereUniqueInput | LobbyPlayerWhereUniqueInput[]
    connect?: LobbyPlayerWhereUniqueInput | LobbyPlayerWhereUniqueInput[]
    update?: LobbyPlayerUpdateWithWhereUniqueWithoutLobbyInput | LobbyPlayerUpdateWithWhereUniqueWithoutLobbyInput[]
    updateMany?: LobbyPlayerUpdateManyWithWhereWithoutLobbyInput | LobbyPlayerUpdateManyWithWhereWithoutLobbyInput[]
    deleteMany?: LobbyPlayerScalarWhereInput | LobbyPlayerScalarWhereInput[]
  }

  export type ChatMessageUncheckedUpdateManyWithoutLobbyNestedInput = {
    create?: XOR<ChatMessageCreateWithoutLobbyInput, ChatMessageUncheckedCreateWithoutLobbyInput> | ChatMessageCreateWithoutLobbyInput[] | ChatMessageUncheckedCreateWithoutLobbyInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutLobbyInput | ChatMessageCreateOrConnectWithoutLobbyInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutLobbyInput | ChatMessageUpsertWithWhereUniqueWithoutLobbyInput[]
    createMany?: ChatMessageCreateManyLobbyInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutLobbyInput | ChatMessageUpdateWithWhereUniqueWithoutLobbyInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutLobbyInput | ChatMessageUpdateManyWithWhereWithoutLobbyInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type LobbyCreateNestedOneWithoutPlayersInput = {
    create?: XOR<LobbyCreateWithoutPlayersInput, LobbyUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: LobbyCreateOrConnectWithoutPlayersInput
    connect?: LobbyWhereUniqueInput
  }

  export type EnumPlayerRoleFieldUpdateOperationsInput = {
    set?: $Enums.PlayerRole
  }

  export type LobbyUpdateOneRequiredWithoutPlayersNestedInput = {
    create?: XOR<LobbyCreateWithoutPlayersInput, LobbyUncheckedCreateWithoutPlayersInput>
    connectOrCreate?: LobbyCreateOrConnectWithoutPlayersInput
    upsert?: LobbyUpsertWithoutPlayersInput
    connect?: LobbyWhereUniqueInput
    update?: XOR<XOR<LobbyUpdateToOneWithWhereWithoutPlayersInput, LobbyUpdateWithoutPlayersInput>, LobbyUncheckedUpdateWithoutPlayersInput>
  }

  export type LobbyCreateNestedOneWithoutChatMessagesInput = {
    create?: XOR<LobbyCreateWithoutChatMessagesInput, LobbyUncheckedCreateWithoutChatMessagesInput>
    connectOrCreate?: LobbyCreateOrConnectWithoutChatMessagesInput
    connect?: LobbyWhereUniqueInput
  }

  export type LobbyUpdateOneRequiredWithoutChatMessagesNestedInput = {
    create?: XOR<LobbyCreateWithoutChatMessagesInput, LobbyUncheckedCreateWithoutChatMessagesInput>
    connectOrCreate?: LobbyCreateOrConnectWithoutChatMessagesInput
    upsert?: LobbyUpsertWithoutChatMessagesInput
    connect?: LobbyWhereUniqueInput
    update?: XOR<XOR<LobbyUpdateToOneWithWhereWithoutChatMessagesInput, LobbyUpdateWithoutChatMessagesInput>, LobbyUncheckedUpdateWithoutChatMessagesInput>
  }

  export type EnumInvitationStatusFieldUpdateOperationsInput = {
    set?: $Enums.InvitationStatus
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedEnumLobbyStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.LobbyStatus | EnumLobbyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LobbyStatus[] | ListEnumLobbyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LobbyStatus[] | ListEnumLobbyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLobbyStatusFilter<$PrismaModel> | $Enums.LobbyStatus
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedEnumLobbyStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.LobbyStatus | EnumLobbyStatusFieldRefInput<$PrismaModel>
    in?: $Enums.LobbyStatus[] | ListEnumLobbyStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.LobbyStatus[] | ListEnumLobbyStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumLobbyStatusWithAggregatesFilter<$PrismaModel> | $Enums.LobbyStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumLobbyStatusFilter<$PrismaModel>
    _max?: NestedEnumLobbyStatusFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedEnumPlayerRoleFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | EnumPlayerRoleFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerRoleFilter<$PrismaModel> | $Enums.PlayerRole
  }

  export type NestedEnumPlayerRoleWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.PlayerRole | EnumPlayerRoleFieldRefInput<$PrismaModel>
    in?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    notIn?: $Enums.PlayerRole[] | ListEnumPlayerRoleFieldRefInput<$PrismaModel>
    not?: NestedEnumPlayerRoleWithAggregatesFilter<$PrismaModel> | $Enums.PlayerRole
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumPlayerRoleFilter<$PrismaModel>
    _max?: NestedEnumPlayerRoleFilter<$PrismaModel>
  }

  export type NestedEnumInvitationStatusFilter<$PrismaModel = never> = {
    equals?: $Enums.InvitationStatus | EnumInvitationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvitationStatus[] | ListEnumInvitationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvitationStatus[] | ListEnumInvitationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvitationStatusFilter<$PrismaModel> | $Enums.InvitationStatus
  }

  export type NestedEnumInvitationStatusWithAggregatesFilter<$PrismaModel = never> = {
    equals?: $Enums.InvitationStatus | EnumInvitationStatusFieldRefInput<$PrismaModel>
    in?: $Enums.InvitationStatus[] | ListEnumInvitationStatusFieldRefInput<$PrismaModel>
    notIn?: $Enums.InvitationStatus[] | ListEnumInvitationStatusFieldRefInput<$PrismaModel>
    not?: NestedEnumInvitationStatusWithAggregatesFilter<$PrismaModel> | $Enums.InvitationStatus
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedEnumInvitationStatusFilter<$PrismaModel>
    _max?: NestedEnumInvitationStatusFilter<$PrismaModel>
  }

  export type LobbyPlayerCreateWithoutLobbyInput = {
    id?: string
    playerAddress: string
    role: $Enums.PlayerRole
    joinedAt?: Date | string
  }

  export type LobbyPlayerUncheckedCreateWithoutLobbyInput = {
    id?: string
    playerAddress: string
    role: $Enums.PlayerRole
    joinedAt?: Date | string
  }

  export type LobbyPlayerCreateOrConnectWithoutLobbyInput = {
    where: LobbyPlayerWhereUniqueInput
    create: XOR<LobbyPlayerCreateWithoutLobbyInput, LobbyPlayerUncheckedCreateWithoutLobbyInput>
  }

  export type LobbyPlayerCreateManyLobbyInputEnvelope = {
    data: LobbyPlayerCreateManyLobbyInput | LobbyPlayerCreateManyLobbyInput[]
    skipDuplicates?: boolean
  }

  export type ChatMessageCreateWithoutLobbyInput = {
    id?: string
    playerAddress: string
    message: string
    timestamp?: Date | string
  }

  export type ChatMessageUncheckedCreateWithoutLobbyInput = {
    id?: string
    playerAddress: string
    message: string
    timestamp?: Date | string
  }

  export type ChatMessageCreateOrConnectWithoutLobbyInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutLobbyInput, ChatMessageUncheckedCreateWithoutLobbyInput>
  }

  export type ChatMessageCreateManyLobbyInputEnvelope = {
    data: ChatMessageCreateManyLobbyInput | ChatMessageCreateManyLobbyInput[]
    skipDuplicates?: boolean
  }

  export type LobbyPlayerUpsertWithWhereUniqueWithoutLobbyInput = {
    where: LobbyPlayerWhereUniqueInput
    update: XOR<LobbyPlayerUpdateWithoutLobbyInput, LobbyPlayerUncheckedUpdateWithoutLobbyInput>
    create: XOR<LobbyPlayerCreateWithoutLobbyInput, LobbyPlayerUncheckedCreateWithoutLobbyInput>
  }

  export type LobbyPlayerUpdateWithWhereUniqueWithoutLobbyInput = {
    where: LobbyPlayerWhereUniqueInput
    data: XOR<LobbyPlayerUpdateWithoutLobbyInput, LobbyPlayerUncheckedUpdateWithoutLobbyInput>
  }

  export type LobbyPlayerUpdateManyWithWhereWithoutLobbyInput = {
    where: LobbyPlayerScalarWhereInput
    data: XOR<LobbyPlayerUpdateManyMutationInput, LobbyPlayerUncheckedUpdateManyWithoutLobbyInput>
  }

  export type LobbyPlayerScalarWhereInput = {
    AND?: LobbyPlayerScalarWhereInput | LobbyPlayerScalarWhereInput[]
    OR?: LobbyPlayerScalarWhereInput[]
    NOT?: LobbyPlayerScalarWhereInput | LobbyPlayerScalarWhereInput[]
    id?: StringFilter<"LobbyPlayer"> | string
    lobbyId?: StringFilter<"LobbyPlayer"> | string
    playerAddress?: StringFilter<"LobbyPlayer"> | string
    role?: EnumPlayerRoleFilter<"LobbyPlayer"> | $Enums.PlayerRole
    joinedAt?: DateTimeFilter<"LobbyPlayer"> | Date | string
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutLobbyInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutLobbyInput, ChatMessageUncheckedUpdateWithoutLobbyInput>
    create: XOR<ChatMessageCreateWithoutLobbyInput, ChatMessageUncheckedCreateWithoutLobbyInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutLobbyInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutLobbyInput, ChatMessageUncheckedUpdateWithoutLobbyInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutLobbyInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutLobbyInput>
  }

  export type ChatMessageScalarWhereInput = {
    AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    OR?: ChatMessageScalarWhereInput[]
    NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    lobbyId?: StringFilter<"ChatMessage"> | string
    playerAddress?: StringFilter<"ChatMessage"> | string
    message?: StringFilter<"ChatMessage"> | string
    timestamp?: DateTimeFilter<"ChatMessage"> | Date | string
  }

  export type LobbyCreateWithoutPlayersInput = {
    id?: string
    code: string
    hostAddress: string
    status?: $Enums.LobbyStatus
    created?: Date | string
    lastActivity?: Date | string
    currentMatch?: string | null
    chatMessages?: ChatMessageCreateNestedManyWithoutLobbyInput
  }

  export type LobbyUncheckedCreateWithoutPlayersInput = {
    id?: string
    code: string
    hostAddress: string
    status?: $Enums.LobbyStatus
    created?: Date | string
    lastActivity?: Date | string
    currentMatch?: string | null
    chatMessages?: ChatMessageUncheckedCreateNestedManyWithoutLobbyInput
  }

  export type LobbyCreateOrConnectWithoutPlayersInput = {
    where: LobbyWhereUniqueInput
    create: XOR<LobbyCreateWithoutPlayersInput, LobbyUncheckedCreateWithoutPlayersInput>
  }

  export type LobbyUpsertWithoutPlayersInput = {
    update: XOR<LobbyUpdateWithoutPlayersInput, LobbyUncheckedUpdateWithoutPlayersInput>
    create: XOR<LobbyCreateWithoutPlayersInput, LobbyUncheckedCreateWithoutPlayersInput>
    where?: LobbyWhereInput
  }

  export type LobbyUpdateToOneWithWhereWithoutPlayersInput = {
    where?: LobbyWhereInput
    data: XOR<LobbyUpdateWithoutPlayersInput, LobbyUncheckedUpdateWithoutPlayersInput>
  }

  export type LobbyUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    hostAddress?: StringFieldUpdateOperationsInput | string
    status?: EnumLobbyStatusFieldUpdateOperationsInput | $Enums.LobbyStatus
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    currentMatch?: NullableStringFieldUpdateOperationsInput | string | null
    chatMessages?: ChatMessageUpdateManyWithoutLobbyNestedInput
  }

  export type LobbyUncheckedUpdateWithoutPlayersInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    hostAddress?: StringFieldUpdateOperationsInput | string
    status?: EnumLobbyStatusFieldUpdateOperationsInput | $Enums.LobbyStatus
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    currentMatch?: NullableStringFieldUpdateOperationsInput | string | null
    chatMessages?: ChatMessageUncheckedUpdateManyWithoutLobbyNestedInput
  }

  export type LobbyCreateWithoutChatMessagesInput = {
    id?: string
    code: string
    hostAddress: string
    status?: $Enums.LobbyStatus
    created?: Date | string
    lastActivity?: Date | string
    currentMatch?: string | null
    players?: LobbyPlayerCreateNestedManyWithoutLobbyInput
  }

  export type LobbyUncheckedCreateWithoutChatMessagesInput = {
    id?: string
    code: string
    hostAddress: string
    status?: $Enums.LobbyStatus
    created?: Date | string
    lastActivity?: Date | string
    currentMatch?: string | null
    players?: LobbyPlayerUncheckedCreateNestedManyWithoutLobbyInput
  }

  export type LobbyCreateOrConnectWithoutChatMessagesInput = {
    where: LobbyWhereUniqueInput
    create: XOR<LobbyCreateWithoutChatMessagesInput, LobbyUncheckedCreateWithoutChatMessagesInput>
  }

  export type LobbyUpsertWithoutChatMessagesInput = {
    update: XOR<LobbyUpdateWithoutChatMessagesInput, LobbyUncheckedUpdateWithoutChatMessagesInput>
    create: XOR<LobbyCreateWithoutChatMessagesInput, LobbyUncheckedCreateWithoutChatMessagesInput>
    where?: LobbyWhereInput
  }

  export type LobbyUpdateToOneWithWhereWithoutChatMessagesInput = {
    where?: LobbyWhereInput
    data: XOR<LobbyUpdateWithoutChatMessagesInput, LobbyUncheckedUpdateWithoutChatMessagesInput>
  }

  export type LobbyUpdateWithoutChatMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    hostAddress?: StringFieldUpdateOperationsInput | string
    status?: EnumLobbyStatusFieldUpdateOperationsInput | $Enums.LobbyStatus
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    currentMatch?: NullableStringFieldUpdateOperationsInput | string | null
    players?: LobbyPlayerUpdateManyWithoutLobbyNestedInput
  }

  export type LobbyUncheckedUpdateWithoutChatMessagesInput = {
    id?: StringFieldUpdateOperationsInput | string
    code?: StringFieldUpdateOperationsInput | string
    hostAddress?: StringFieldUpdateOperationsInput | string
    status?: EnumLobbyStatusFieldUpdateOperationsInput | $Enums.LobbyStatus
    created?: DateTimeFieldUpdateOperationsInput | Date | string
    lastActivity?: DateTimeFieldUpdateOperationsInput | Date | string
    currentMatch?: NullableStringFieldUpdateOperationsInput | string | null
    players?: LobbyPlayerUncheckedUpdateManyWithoutLobbyNestedInput
  }

  export type LobbyPlayerCreateManyLobbyInput = {
    id?: string
    playerAddress: string
    role: $Enums.PlayerRole
    joinedAt?: Date | string
  }

  export type ChatMessageCreateManyLobbyInput = {
    id?: string
    playerAddress: string
    message: string
    timestamp?: Date | string
  }

  export type LobbyPlayerUpdateWithoutLobbyInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LobbyPlayerUncheckedUpdateWithoutLobbyInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LobbyPlayerUncheckedUpdateManyWithoutLobbyInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    role?: EnumPlayerRoleFieldUpdateOperationsInput | $Enums.PlayerRole
    joinedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUpdateWithoutLobbyInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateWithoutLobbyInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutLobbyInput = {
    id?: StringFieldUpdateOperationsInput | string
    playerAddress?: StringFieldUpdateOperationsInput | string
    message?: StringFieldUpdateOperationsInput | string
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}