import { Controller } from '@nestjs/common';
import { EmailConfirmationService } from './emailConfirmation.service';

@Controller('email-confirmation')
export class EmailConfirmationController {
  constructor(private emailConfirmationService: EmailConfirmationService) {}
}
