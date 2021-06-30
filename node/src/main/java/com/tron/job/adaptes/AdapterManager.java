package com.tron.job.adaptes;

import com.tron.common.Constant;
import com.tron.web.common.util.JsonUtil;
import com.tron.web.entity.TaskParams;
import com.tron.web.entity.TaskRun;
import com.tron.web.entity.TaskSpec;

public class AdapterManager {

  public static BaseAdapter getAdapter(TaskSpec taskSpec) {
    BaseAdapter adapter = null;
    TaskParams params = JsonUtil.json2Obj(taskSpec.getParams(), TaskParams.class);
    switch (taskSpec.getType()){
      case Constant.TASK_TYPE_HTTP_GET:
        adapter = new HttpGetAdapter(params.getGet(), params.getPath());
        break;
      case Constant.TASK_TYPE_HTTP_POST:
        adapter = null;
        break;
      case Constant.TASK_TYPE_MULTIPLY:
        adapter = new MultiplyAdapter(params.getTimes());
        break;
      case Constant.TASK_TYPE_CONVERT_USD:
        adapter = new ConvertUsdAdapter();
        break;
      case Constant.TASK_TYPE_TRON_TX:
        adapter = new TronTxAdapter();
        break;
      default:
        break;
    }

    return adapter;
  }
}
