"use client";

import React, { useMemo } from "react";
import View360, { EquirectProjection } from "@egjs/react-view360";

function TSTV({ image }: { image: string }) {
  const projection = useMemo(() => new EquirectProjection({
    src: image
  }), []);

  return (
    <div className="h-[550px] md:h-[700px] object-cover block sm:hidden">
      <View360 fov={100} autoplay={true} className="is-9by16 object-cover w-full" projection={projection} />
    </div>
  )
}

export default TSTV