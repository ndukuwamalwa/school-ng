import { Component, OnInit } from '@angular/core';
import { MenuItem, PrimeIcons, MessageService, ConfirmationService } from 'primeng/api';
import { SessionService } from 'src/services/session.service';
import { NgForm } from '@angular/forms';
import { Bank, BankBranch } from 'src/models/models';
import { Apollo, gql } from 'apollo-angular';
import { GET_BANKS_QUERY, GET_BANK_BRANCHES } from '../cash-book.query';
import { GraphQLEssentials } from 'src/essentials/graphql.essentials';
import { DocumentNode } from 'graphql';

@Component({
  selector: 'app-banks',
  templateUrl: './banks.component.html',
  styleUrls: ['./banks.component.scss']
})
export class BanksComponent implements OnInit {
  bankAction: 'Add' | 'Update' | '' = '';
  bankMenu: Array<MenuItem>;
  showBankDialog = false;
  bank: Bank = undefined as any;
  banks: Array<Bank> = [];
  branches: Array<BankBranch> = [];
  showBranches = false;
  currentBank: Bank = undefined as any;
  branchAction: 'Add' | 'Update' | '' = '';
  showAddBranch = false;
  branch: BankBranch = undefined as any;

  constructor(
    private sessionService: SessionService,
    private apollo: Apollo,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    this.bankMenu = [
      {
        label: 'New',
        icon: PrimeIcons.PLUS_CIRCLE,
        visible: this.sessionService.canAccessItem('CASHBOOK.DEFINE_BANKS'),
        command: () => {
          this.showBankDialog = true;
          this.bank = undefined as any;
          this.bankAction = 'Add';
        }
      }
    ];
  }

  ngOnInit(): void {
    this.apollo.watchQuery({
      query: GET_BANKS_QUERY
    })
    .valueChanges
    .subscribe(res => {
      if (res.data) {
        this.banks = (res.data as any).banks;
      }
    });
  }

  saveBank(form: NgForm): void {
    const bank: Bank = form.value;
    let endPoint = 'addBank';
    if (this.bankAction === 'Update') {
      bank.id = this.bank.id;
      endPoint = 'updateBank';
    }
    this.apollo.mutate({
      mutation: gql`mutation m($bank: BankInput!) {
        ${endPoint}(bank: $bank) {
          success
          message
        }
      }`,
      refetchQueries: [{ query: GET_BANKS_QUERY }],
      variables: {
        bank
      }
    })
    .subscribe(res => {
      const result = GraphQLEssentials.handleMutationResponse(res, endPoint);
      this.messageService.add(result.message);
      if (result.success) {
        form.reset();
        this.showBankDialog = false;
      }
    });
  }

  private fetchBranches(): void {
    this.apollo.query({
      query: GET_BANK_BRANCHES(this.currentBank.id),
      fetchPolicy: 'network-only'
    })
    .subscribe(res => {
      if (res.data) {
        this.branches = (res.data as any).bankBranches;
      }
    });
  }

  onViewBranches(bank: Bank): void {
    this.currentBank = bank;
    this.fetchBranches();
    this.showBranches = true;
  }

  onAddBranch(): void {
    this.showAddBranch = true;
    this.branchAction = 'Add';
  }

  saveBranch(form: NgForm): void {
    const branch: BankBranch = form.value;
    const branches: Array<BankBranch> = [branch];
    let mutation: DocumentNode;
    let endPoint = 'addBankBranches';
    branch.bank = this.currentBank.id;
    if (this.branchAction === 'Add') {
      mutation = gql`mutation m($branches: [BankBranchInput!]!) {
        addBankBranches(branches: $branches) {
          success
          message
        }
      }`;
    } else {
      branch.id = this.branch.id;
      endPoint = 'updateBankBranch';
      mutation = gql`mutation m($branches: BankBranchInput!) {
        updateBankBranch(branch: $branches){
          success
          message
        }
      }`;
    }

    this.apollo.mutate({
      mutation,
      variables: {
        branches: this.branchAction === 'Add' ? branches : branch
      }
    })
    .subscribe(res => {
      const result = GraphQLEssentials.handleMutationResponse(res, endPoint);
      this.messageService.add(result.message);
      if (result.success) {
        form.reset();
        this.showAddBranch = false;
        this.fetchBranches();
      }
    });
  }

  onEditBranch(branch: BankBranch): void {
    this.branch = branch;
    this.showAddBranch = true;
    this.branchAction = 'Update';
  }

  onDeleteBranch(branch: BankBranch): void {
    this.confirmationService.confirm({
      header: `Delete Branch`,
      message: `Delete branch ${branch.town} for bank ${this.currentBank.description}?`,
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accept: () => {
        this.apollo.mutate({
          mutation: gql`mutation m {
            deleteBankBranch(id: ${branch.id}) {
              success
              message
            }
          }`
        })
        .subscribe(res => {
          const result = GraphQLEssentials.handleMutationResponse(res, 'deleteBankBranch');
          this.messageService.add(result.message);
          if (result.success) {
            this.fetchBranches();
          }
        });
      }
    });
  }

  onUpdate(bank: Bank): void {
    this.currentBank = bank;
    this.bank = bank;
    this.showBankDialog = true;
    this.bankAction = 'Update';
  }

  onDelete(bank: Bank): void {
    this.confirmationService.confirm({
      header: `Delete bank`,
      message: `Delete ${bank.description}(${bank.shortDesc})?`,
      icon: PrimeIcons.EXCLAMATION_TRIANGLE,
      accept: () => {
        this.apollo.mutate({
          mutation: gql`mutation m {
            deleteBank(id: ${bank.id}) {
              success
              message
            }
          }`,
          refetchQueries: [ { query: GET_BANKS_QUERY } ]
        })
        .subscribe(res => {
          const result = GraphQLEssentials.handleMutationResponse(res, 'deleteBank');
          this.messageService.add(result.message);
        });
      }
    });
  }

}
