package com.tron.job.adaptes;

import com.tron.web.common.util.R;
import lombok.Getter;

public class MultiplyAdapter extends BaseAdapter {
  @Getter
  private Long times;

  public MultiplyAdapter(Long t) {
    times = t;
  }

  @Override
  public String taskType() {
    return "multiply";
  }

  @Override
  public R perform(R input) {
    R result = new R();
    result.put("result", Math.round((double)input.get("result") * times));
    return result;
  }
}
