import { DynamicModule, Module } from '@nestjs/common';

import { DealernetCustomerModule } from './customer/customer.module';
import { DealernetService } from './dealernet.service';
import { DealernetScheduleModule } from './schedule/schedule.module';
import { DealernetVehicleModelModule } from './vehicle-model/vehicle-model.module';
import { DealernetVehicleModule } from './vehicle/vehicle.module';

@Module({
  imports: [DealernetScheduleModule.forRoot(), DealernetCustomerModule, DealernetVehicleModule, DealernetVehicleModelModule],
  providers: [DealernetService],
  exports: [DealernetService],
})
export class DealernetModule {
  static forRoot(): DynamicModule {
    return {
      global: true,
      module: DealernetModule,
    };
  }
}
