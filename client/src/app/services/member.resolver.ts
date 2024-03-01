import { ActivatedRouteSnapshot, ResolveFn } from '@angular/router';
import { AccountService } from './account.service';
import { inject } from '@angular/core';
import { Member } from '../models/user';

export const memberResolver: ResolveFn<Member> = (route, state) => {
  const memberService = inject(AccountService);

  return memberService.getMember(route.paramMap.get('username')!);
};
