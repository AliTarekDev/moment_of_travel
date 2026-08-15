import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faEye, faPlus, faTrash, faXmark } from '@fortawesome/free-solid-svg-icons';
import { StaffUser, UserRole } from '../../core/api.models';

@Component({
  selector:'app-team-view', standalone:true, imports:[CommonModule,FormsModule,MatButtonModule,MatTableModule,MatTooltipModule,FontAwesomeModule],
  template:`<section class="team-layout"><form class="panel user-form" *ngIf="showNewUser && currentUser.role==='admin'" (ngSubmit)="createRequested.emit()"><div class="panel-heading"><div><span class="eyebrow">صلاحيات آمنة</span><h2>إضافة موظف</h2></div><button mat-icon-button type="button" class="close" (click)="showNewUserChange.emit(false)" aria-label="إغلاق النموذج"><fa-icon [icon]="icons.close" /></button></div><div class="form-grid"><label><span>الاسم الكامل</span><input required minlength="2" [(ngModel)]="newUser.fullName" name="fullName" /></label><label><span>البريد الإلكتروني للعمل</span><input required type="email" [(ngModel)]="newUser.email" name="email" /></label><label><span>كلمة مرور مؤقتة</span><input required minlength="12" type="password" [(ngModel)]="newUser.password" name="password" /><small>12 حرفاً على الأقل، وأرسلها للموظف بطريقة آمنة.</small></label><label><span>الصلاحية</span><select [(ngModel)]="newUser.role" name="role"><option *ngFor="let role of roles" [value]="role">{{ label(role) }}</option></select></label></div><button mat-flat-button class="primary" type="submit" [disabled]="saving"><fa-icon [icon]="icons.add" /> {{ saving ? 'جارٍ الإنشاء…' : 'إنشاء حساب الموظف' }}</button></form>
  <section class="panel team-table-panel"><div class="panel-heading"><div><span class="eyebrow">دليل الصلاحيات</span><h2>أعضاء فريق العمل</h2></div><span class="result-count">{{ users.length }} حساب</span></div><div class="table-wrap"><table mat-table [dataSource]="users" class="team-table"><ng-container matColumnDef="member"><th mat-header-cell *matHeaderCellDef>الموظف</th><td mat-cell *matCellDef="let member"><div class="member-cell"><span>{{ initials(member.fullName) }}</span><strong>{{ member.fullName }}</strong></div></td></ng-container><ng-container matColumnDef="email"><th mat-header-cell *matHeaderCellDef>البريد الإلكتروني</th><td mat-cell *matCellDef="let member">{{ member.email }}</td></ng-container><ng-container matColumnDef="role"><th mat-header-cell *matHeaderCellDef>الصلاحية</th><td mat-cell *matCellDef="let member"><span class="role-pill">{{ label(member.role) }}</span></td></ng-container><ng-container matColumnDef="status"><th mat-header-cell *matHeaderCellDef>الحالة</th><td mat-cell *matCellDef="let member"><span class="member-status" [class.inactive]="member.active===false"><i></i>{{ member.active===false ? 'غير نشط' : 'نشط' }}</span></td></ng-container><ng-container matColumnDef="created"><th mat-header-cell *matHeaderCellDef>تاريخ الإنشاء</th><td mat-cell *matCellDef="let member">{{ member.createdAt ? (member.createdAt | date:'d MMM y') : '—' }}</td></ng-container><ng-container matColumnDef="actions"><th mat-header-cell *matHeaderCellDef><span class="sr-only">الإجراءات</span></th><td mat-cell *matCellDef="let member" class="team-actions"><button mat-icon-button type="button" (click)="viewRequested.emit(member);$event.stopPropagation()" aria-label="عرض تفاصيل الموظف" matTooltip="عرض التفاصيل"><fa-icon [icon]="icons.eye" /></button><button mat-icon-button type="button" *ngIf="currentUser.role==='admin' && currentUser.id!==member.id" (click)="deleteRequested.emit(member);$event.stopPropagation()" [disabled]="deletingUserId===member.id" aria-label="حذف الموظف" matTooltip="حذف الموظف" class="delete-action"><fa-icon [icon]="icons.trash" /></button></td></ng-container><tr mat-header-row *matHeaderRowDef="columns"></tr><tr mat-row *matRowDef="let member;columns:columns" (click)="viewRequested.emit(member)"></tr></table><p class="empty" *ngIf="!users.length">لا توجد حسابات موظفين.</p></div></section></section>`,
})
export class TeamViewComponent {
  @Input({required:true}) currentUser!:StaffUser;
  @Input() users:StaffUser[]=[];
  @Input() showNewUser=false;
  @Input() saving=false;
  @Input() deletingUserId='';
  @Input({required:true}) newUser!:{fullName:string;email:string;password:string;role:UserRole};
  @Output() showNewUserChange=new EventEmitter<boolean>();
  @Output() createRequested=new EventEmitter<void>();
  @Output() viewRequested=new EventEmitter<StaffUser>();
  @Output() deleteRequested=new EventEmitter<StaffUser>();
  readonly roles:UserRole[]=['manager','reception','accountant']; readonly columns=['member','email','role','status','created','actions']; readonly icons={add:faPlus,close:faXmark,eye:faEye,trash:faTrash};
  label(value:string):string{return ({admin:'مسؤول النظام',manager:'مدير',reception:'موظف استقبال',accountant:'محاسب'} as Record<string,string>)[value]??value;}
  initials(name:string):string{return name.split(' ').slice(0,2).map(part=>part[0]).join('').toUpperCase();}
}
