import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatStepperModule } from '@angular/material/stepper';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faAddressCard, faArrowLeft, faArrowRight, faFileShield, faPaperclip, faPlus, faUser } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';
import { TravelClient, TravelClientPayload } from '../../core/api.models';
import { OperationsApiService } from '../../core/operations-api.service';

@Component({
  selector:'app-clients-view', standalone:true, imports:[CommonModule,ReactiveFormsModule,MatButtonModule,MatStepperModule,FontAwesomeModule],
  template:`
    <section class="clients-heading"><div><span class="eyebrow">ملفات المسافرين</span><h2>العملاء</h2><p>البيانات والوثائق محمية ولا تظهر في الموقع العام.</p></div>@if (!editing) {
    <button mat-flat-button class="primary" type="button" (click)="startCreate()"><fa-icon [icon]="icons.add" /> إضافة عميل</button>
    }</section>
    @if (error) {
      <div class="alert"><span>!</span>{{ error }}<button type="button" (click)="error=''">×</button></div>
    }

    @if (editing) {
      <section class="client-editor panel">
        <header><div><span class="eyebrow">ملف عميل جديد</span><h2>إضافة بيانات المسافر</h2></div><span class="privacy-note"><fa-icon [icon]="icons.secure" /> مستندات خاصة</span></header>
        <mat-stepper linear #stepper animationDuration="300ms">
          <mat-step [stepControl]="personalForm" label="البيانات الشخصية">
            <form class="step-form" [formGroup]="personalForm">
              <div class="step-title"><i><fa-icon [icon]="icons.user" /></i><div><h3>البيانات الشخصية</h3><p>بيانات التواصل والهوية الأساسية للعميل.</p></div></div>
              <div class="client-fields">
                <label class="wide"><span>الاسم الكامل *</span><input formControlName="fullName" autocomplete="name" /></label>
                <label><span>رقم الموبايل *</span><input formControlName="mobile" autocomplete="tel" dir="ltr" /></label>
                <label><span>واتساب</span><input formControlName="whatsapp" autocomplete="tel" dir="ltr" /></label>
                <label><span>البريد الإلكتروني</span><input type="email" formControlName="email" autocomplete="email" dir="ltr" /></label>
                <label><span>الجنسية *</span><select formControlName="nationality"><option value="">اختر الجنسية</option>@for (country of countries; track country) {
                <option [value]="country.code">{{ country.name }}</option>
              }</select></label>
              <label><span>تاريخ الميلاد *</span><input type="date" formControlName="birthDate" [max]="today" /></label>
              <label><span>الجنس *</span><select formControlName="gender"><option value="male">ذكر</option><option value="female">أنثى</option></select></label>
              <label><span>الحالة الاجتماعية *</span><select formControlName="maritalStatus"><option value="single">أعزب/عزباء</option><option value="married">متزوج/متزوجة</option><option value="divorced">مطلق/مطلقة</option><option value="widowed">أرمل/أرملة</option></select></label>
              <label><span>اسم المحرم</span><input formControlName="mahramName" /></label><label><span>صلة المحرم</span><input formControlName="mahramRelationship" /></label>
              <label class="wide"><span>ملاحظات</span><textarea rows="4" formControlName="notes"></textarea></label>
              </div><div class="step-navigation"><button mat-flat-button class="primary" type="button" matStepperNext [disabled]="personalForm.invalid">التالي <fa-icon [icon]="icons.next" /></button></div>
            </form>
          </mat-step>
          <mat-step [stepControl]="documentsForm" label="وثائق السفر">
            <form class="step-form" [formGroup]="documentsForm"><div class="step-title"><i><fa-icon [icon]="icons.card" /></i><div><h3>وثائق السفر</h3><p>تحقق من الأرقام والتواريخ كما تظهر في المستندات الأصلية.</p></div></div><div class="client-fields"><label><span>الرقم القومي *</span><input formControlName="nationalId" dir="ltr" /></label><label><span>رقم الجواز *</span><input formControlName="passportNumber" dir="ltr" /></label><label><span>تاريخ انتهاء الجواز *</span><input type="date" formControlName="passportExpiry" [min]="today" /></label></div><div class="step-navigation"><button mat-button type="button" matStepperPrevious><fa-icon [icon]="icons.previous" /> السابق</button><button mat-flat-button class="primary" type="button" matStepperNext [disabled]="documentsForm.invalid">التالي <fa-icon [icon]="icons.next" /></button></div></form>
          </mat-step>
          <mat-step label="المرفقات">
            <div class="step-form"><div class="step-title"><i><fa-icon [icon]="icons.attach" /></i><div><h3>المرفقات</h3><p>JPG أو PNG أو WebP، بحد أقصى 5MB للصورة.</p></div></div><div class="attachment-grid">
            <label [class.ready]="files.passport"><span>صورة الجواز *</span><strong>{{ files.passport?.name || 'اختر صورة الجواز' }}</strong><input type="file" accept="image/jpeg,image/png,image/webp" (change)="chooseFile('passport',$event)" /></label>
            <label [class.ready]="files.national_id"><span>صورة البطاقة *</span><strong>{{ files.national_id?.name || 'اختر صورة البطاقة' }}</strong><input type="file" accept="image/jpeg,image/png,image/webp" (change)="chooseFile('national_id',$event)" /></label>
            <label [class.ready]="files.portrait"><span>الصورة الشخصية *</span><strong>{{ files.portrait?.name || 'اختر الصورة الشخصية' }}</strong><input type="file" accept="image/jpeg,image/png,image/webp" (change)="chooseFile('portrait',$event)" /></label>
            </div><div class="step-navigation"><button mat-button type="button" matStepperPrevious><fa-icon [icon]="icons.previous" /> السابق</button></div></div>
          </mat-step>
        </mat-stepper>
        <footer class="editor-actions"><small>يتم حفظ المراحل الثلاث معاً بعد التحقق من كل الحقول.</small><div><button mat-button type="button" (click)="cancel()" [disabled]="saving">إلغاء</button><button mat-flat-button class="primary" type="button" (click)="save()" [disabled]="saving">{{ saving ? 'جارٍ الحفظ…' : 'حفظ العميل' }}</button></div></footer>
      </section>
    }

    @if (!editing) {
      <section class="panel clients-list"><div class="filters"><label class="search"><span>⌕</span><input [value]="search" (input)="search=$any($event.target).value" (keyup.enter)="load()" placeholder="ابحث بالاسم أو الهاتف أو رقم الجواز" /></label><button class="secondary" type="button" (click)="load()">بحث</button><span class="result-count">{{ clients.length }} عميل</span></div><div class="table-wrap"><table><thead><tr><th>العميل</th><th>الموبايل</th><th>الجنسية</th><th>رقم الجواز</th><th>الوثائق</th><th>تاريخ الإضافة</th></tr></thead><tbody>@for (client of clients; track client) {
      <tr><td><strong>{{ client.fullName }}</strong><small>{{ client.email || 'بدون بريد إلكتروني' }}</small></td><td dir="ltr">{{ client.mobile }}</td><td>{{ countryName(client.nationality) }}</td><td>{{ client.passportNumber || '—' }}</td><td><span class="document-count">{{ attachmentCount(client) }}/3</span></td><td>{{ client.createdAt | date:'d MMM y' }}</td></tr>
      }@if (!clients.length) {
      <tr><td colspan="6" class="empty">لا يوجد عملاء حتى الآن.</td></tr>
    }</tbody></table></div></section>
    }
    `,
  styles:[`
    :host{display:block}.clients-heading{display:flex;justify-content:space-between;align-items:center;gap:20px;margin-bottom:18px}.clients-heading h2,.client-editor header h2{margin:6px 0 3px;font:500 24px Georgia,serif}.clients-heading p{margin:0;color:#818a87;font-size:10px}.client-editor{overflow:hidden}.client-editor>header{display:flex;justify-content:space-between;align-items:center;padding:21px 24px;border-bottom:1px solid #e2ded7}.privacy-note{display:flex;align-items:center;gap:7px;border-radius:18px;padding:7px 11px;background:#e7efeb;color:#4f7867;font-size:9px;font-weight:800}.step-form{padding:27px 25px 20px}.step-title{display:flex;align-items:center;gap:13px;margin-bottom:22px}.step-title>i{width:43px;height:43px;display:grid;place-items:center;border-radius:12px;background:#eee5e1;color:#955f68;font-size:17px}.step-title h3{margin:0 0 4px;font:600 18px Georgia,serif}.step-title p{margin:0;color:#89918f;font-size:9px}.client-fields{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}.client-fields label{display:grid;gap:7px;color:#596561;font-size:9px;font-weight:800}.client-fields .wide{grid-column:span 2}.client-fields input,.client-fields select,.client-fields textarea{width:100%;border:1px solid #d9d5cd;border-radius:9px;padding:11px;background:#fff;color:#34413e;font:inherit;font-weight:400;outline:none}.client-fields input:focus,.client-fields select:focus,.client-fields textarea:focus{border-color:#a76a73;box-shadow:0 0 0 3px rgba(163,101,111,.09)}.step-navigation{display:flex;justify-content:flex-end;gap:8px;margin-top:23px}.attachment-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:15px}.attachment-grid label{min-height:145px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:1px dashed #c9c4ba;border-radius:13px;background:#fbfaf7;color:#727c79;cursor:pointer;text-align:center}.attachment-grid label.ready{border-color:#729180;background:#f0f6f2;color:#486b59}.attachment-grid span{font-size:11px;font-weight:900}.attachment-grid strong{max-width:90%;overflow:hidden;text-overflow:ellipsis;font-size:9px;font-weight:500}.attachment-grid input{position:absolute;width:1px;height:1px;opacity:0}.editor-actions{position:sticky;bottom:0;z-index:3;display:flex;justify-content:space-between;align-items:center;gap:18px;border-top:1px solid #e1ddd5;padding:15px 24px;background:#fff}.editor-actions small{color:#8b9390;font-size:9px}.editor-actions>div{display:flex;gap:8px}.clients-list{overflow:hidden}.document-count{display:inline-grid;place-items:center;border-radius:12px;padding:5px 9px;background:#e7efeb;color:#4f7867;font-size:9px;font-weight:900}.mat-stepper-horizontal{background:transparent}.alert{margin-bottom:14px}
    @media(max-width:850px){.client-fields{grid-template-columns:1fr 1fr}.attachment-grid{grid-template-columns:1fr}.client-fields .wide{grid-column:span 2}}@media(max-width:560px){.client-fields{grid-template-columns:1fr}.client-fields .wide{grid-column:auto}.editor-actions{align-items:flex-start;flex-direction:column}.clients-heading{align-items:flex-start;flex-direction:column}}
  `]
})
export class ClientsViewComponent implements OnInit{
  private readonly fb=inject(FormBuilder); private readonly api=inject(OperationsApiService);
  clients:TravelClient[]=[];editing=false;saving=false;error='';search='';readonly today=new Date().toISOString().slice(0,10);readonly icons={add:faPlus,user:faUser,card:faAddressCard,secure:faFileShield,attach:faPaperclip,next:faArrowLeft,previous:faArrowRight};
  readonly files:{passport:File|null;national_id:File|null;portrait:File|null}={passport:null,national_id:null,portrait:null};
  readonly personalForm=this.fb.nonNullable.group({fullName:['',[Validators.required,Validators.minLength(2),Validators.maxLength(160)]],mobile:['',[Validators.required,Validators.minLength(7),Validators.maxLength(40)]],whatsapp:['',Validators.maxLength(40)],email:['',[Validators.email,Validators.maxLength(180)]],nationality:['',Validators.required],birthDate:['',Validators.required],gender:['male' as 'male'|'female',Validators.required],maritalStatus:['single' as 'single'|'married'|'divorced'|'widowed',Validators.required],mahramName:['',Validators.maxLength(160)],mahramRelationship:['',Validators.maxLength(100)],notes:['',Validators.maxLength(4000)]});
  readonly documentsForm=this.fb.nonNullable.group({nationalId:['',[Validators.required,Validators.maxLength(30)]],passportNumber:['',[Validators.required,Validators.maxLength(30)]],passportExpiry:['',Validators.required]});
  readonly countries=this.buildCountries();
  ngOnInit():void{this.load();}
  load():void{this.api.clients(this.search).subscribe({next:r=>this.clients=r.data,error:()=>this.error='تعذر تحميل العملاء.'});}
  startCreate():void{this.editing=true;this.error='';}
  cancel():void{this.editing=false;this.reset();}
  chooseFile(kind:keyof ClientsViewComponent['files'],event:Event):void{const file=(event.target as HTMLInputElement).files?.[0]??null;if(file&&(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>5*1024*1024)){this.error='الصورة يجب أن تكون JPG أو PNG أو WebP وأقل من 5MB.';(event.target as HTMLInputElement).value='';return;}this.files[kind]=file;}
  save():void{this.personalForm.markAllAsTouched();this.documentsForm.markAllAsTouched();if(this.personalForm.invalid||this.documentsForm.invalid){this.error='أكمل الحقول المطلوبة في البيانات الشخصية ووثائق السفر.';return;}if(!this.files.passport||!this.files.national_id||!this.files.portrait){this.error='أضف صور الجواز والبطاقة والصورة الشخصية.';return;}this.saving=true;this.error='';const p=this.personalForm.getRawValue(),d=this.documentsForm.getRawValue();const payload={...p,...d,whatsapp:p.whatsapp||null,email:p.email||null,mahramName:p.mahramName||null,mahramRelationship:p.mahramRelationship||null,notes:p.notes||null} as TravelClientPayload;this.api.createClientWithAttachments(payload,{passport:this.files.passport,national_id:this.files.national_id,portrait:this.files.portrait}).pipe(finalize(()=>this.saving=false)).subscribe({next:()=>{this.editing=false;this.reset();this.load();},error:()=>this.error='تعذر حفظ العميل. تحقق من البيانات والصور، وقد يكون الرقم القومي أو رقم الجواز مسجلاً من قبل.'});}
  attachmentCount(c:TravelClient):number{return[c.passportImageName,c.nationalIdImageName,c.portraitImageName].filter(Boolean).length;}
  countryName(code:string):string{return this.countries.find(c=>c.code===code)?.name??code;}
  private reset():void{this.personalForm.reset({gender:'male',maritalStatus:'single'});this.documentsForm.reset();this.files.passport=null;this.files.national_id=null;this.files.portrait=null;}
  private buildCountries(){const codes='AD AE AF AG AI AL AM AO AR AT AU AZ BA BB BD BE BF BG BH BI BJ BN BO BR BS BT BW BY BZ CA CD CF CG CH CI CL CM CN CO CR CU CV CY CZ DE DJ DK DM DO DZ EC EE EG ER ES ET FI FJ FM FR GA GB GD GE GH GM GN GQ GR GT GW GY HK HN HR HT HU ID IE IL IN IQ IR IS IT JM JO JP KE KG KH KI KM KN KP KR KW KZ LA LB LC LI LK LR LS LT LU LV LY MA MC MD ME MG MH MK ML MM MN MR MT MU MV MW MX MY MZ NA NE NG NI NL NO NP NR NZ OM PA PE PG PH PK PL PS PT PW PY QA RO RS RU RW SA SB SC SD SE SG SI SK SL SM SN SO SR SS ST SV SY SZ TD TG TH TJ TL TM TN TO TR TT TV TW TZ UA UG US UY UZ VA VC VE VN VU WS YE ZA ZM ZW'.split(' ');const names=new Intl.DisplayNames(['ar'],{type:'region'});return codes.map(code=>({code,name:names.of(code)??code})).sort((a,b)=>a.name.localeCompare(b.name,'ar'));}
}
