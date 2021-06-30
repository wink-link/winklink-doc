package com.tron.common;

public class Constant {

  public static final long ONE_HOUR = 60 * 60 * 1000L;
  public static final long ONE_MINUTE = 60 * 1000L;
//  public static final String HTTP_EVENT_HOST = "api.trongrid.io";
//  public static final String FULLNODE_HOST = "api.trongrid.io";

  public static final String HTTP_EVENT_HOST = "event.nileex.io"; // for test
  public static final String FULLNODE_HOST = "api.nileex.io"; // for test

  public static final int HTTP_MAX_RETRY_TIME = 3;

  public static final String FULFIL_METHOD_SIGN =
          "fulfillOracleRequest(bytes32,uint256,address,bytes4,uint256,bytes32)";
          //"fulfillOracleRequest(bytes32,uint256,address,bytes4,uint256,int256)";

  // task type
  public static final String TASK_TYPE_HTTP_GET = "httpget";
  public static final String TASK_TYPE_HTTP_POST = "httppost";
  public static final String TASK_TYPE_TRON_TX = "trontx";
  public static final String TASK_TYPE_MULTIPLY = "multiply";
  public static final String TASK_TYPE_CONVERT_USD = "convertusd";

  // initiator type
  public static final String INITIATOR_TYPE_RUN_LOG = "runlog";
}
