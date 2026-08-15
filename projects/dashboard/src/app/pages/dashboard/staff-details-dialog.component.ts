import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCalendar, faEnvelope, faFloppyDisk, faPen, faShieldHalved, faTrash, faUserCheck } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';
import { StaffUser, UserRole } from '../../core/api.models';
import { OperationsApiService } from '../../core/operations-api.service';

export interface StaffDetailsDialogData {
  member: StaffUser;
  canDelete: boolean;
  canEdit: boolean;
  isCurrentUser: boolean;
}

export type StaffDetailsDialogResult =
  | { action: 'updated'; member: StaffUser }
  | { action: 'delete' }
  | undefined;

@Component({
  selector: 'app-staff-details-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatDialogModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatSlideToggleModule, FontAwesomeModule],
  templateUrl: './staff-details-dialog.component.html',
  styleUrl: './staff-details-dialog.component.scss',
})
export class StaffDetailsDialogComponent {
  readonly icons = { calendar: faCalendar, edit: faPen, email: faEnvelope, role: faShieldHalved, save: faFloppyDisk, status: faUserCheck, trash: faTrash };
  readonly roles: UserRole[] = ['admin', 'manager', 'reception', 'accountant'];
  editable: StaffUser;
  editing = false;
  saving = false;
  error = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) readonly data: StaffDetailsDialogData,
    private readonly dialogRef: MatDialogRef<StaffDetailsDialogComponent>,
    private readonly api: OperationsApiService,
  ) {
    this.editable = { ...data.member, active: data.member.active !== false };
  }

  requestDelete(): void {
    this.dialogRef.close({ action: 'delete' } satisfies StaffDetailsDialogResult);
  }

  startEditing(): void {
    if (this.data.canEdit) this.editing = true;
  }

  cancelEditing(): void {
    this.editable = { ...this.data.member, active: this.data.member.active !== false };
    this.error = '';
    this.editing = false;
  }

  save(): void {
    const fullName = this.editable.fullName.trim();
    const email = this.editable.email.trim().toLowerCase();
    if (!this.data.canEdit || this.saving || fullName.length < 2 || !email.includes('@')) return;

    this.saving = true;
    this.error = '';
    this.api
      .updateUser(this.data.member.id, {
        fullName,
        email,
        role: this.editable.role,
        active: this.editable.active !== false,
      })
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (member) => this.dialogRef.close({ action: 'updated', member } satisfies StaffDetailsDialogResult),
        error: () => (this.error = 'تعذر حفظ التعديلات. تأكد من أن البريد غير مستخدم، ولا تحاول تعديل صلاحية آخر مسؤول نشط.'),
      });
  }

  label(value: string): string {
    const labels: Record<string, string> = {
      admin: 'مسؤول النظام',
      manager: 'مدير',
      reception: 'موظف استقبال',
      accountant: 'محاسب',
    };
    return labels[value] ?? value;
  }
}
