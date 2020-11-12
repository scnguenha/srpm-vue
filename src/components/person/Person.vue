<template>
    <div class="person">
        <PageTitle icon="fa fa-users" main="Membros" sub="Registo de Membro" />
        
        <b-form v-if="mode === 'save'|| mode==='remove'">
            <input id="person-id" type="hidden" v-model="person.id" />
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Nome:" label-for="person-name">
                        <b-form-input id="person-name" type="text" v-model="person.name" required :readonly="mode === 'remove'" placeholder="Informe o Nome" />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Apelido:" label-for="person-surname">
                        <b-form-input id="person-surname" type="text" v-model="person.surname" required :readonly="mode === 'remove'" placeholder="Informe o Apelido" />
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Gênero:" label-for="person-gender">
                        <b-form-radio-group>
                            <b-form-radio v-model="person.gender" value="Masculino" :readonly="mode === 'remove'">Masculino</b-form-radio>
                            <b-form-radio v-model="person.gender" value="Feminino" :readonly="mode === 'remove'">Feminino</b-form-radio>
                        </b-form-radio-group>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Data de Nascimento:" label-for="person-birthdate">
                        <b-form-datepicker id="person-birthdate" v-model="person.birthdate" class="mb-2" :readonly="mode === 'remove'"></b-form-datepicker>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Informação de Baptismo e Confirmação" label-for="person-gender">
                        <b-form-checkbox id="person-baptized" v-model="person.baptized" class="mt-3 mb-3" :readonly="mode === 'remove'"> 
                            Baptizado?
                        </b-form-checkbox>
                        <b-form-checkbox id="person-confirmed" v-model="person.confirmed" class="mt-3 mb-3" :readonly="mode === 'remove'"> 
                            Confirmado?
                        </b-form-checkbox>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Sociedade" label-for="person-society">
                        <b-form-select v-model="person.society" :options="societyOptions" :readonly="mode === 'remove'"></b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Presbitério" label-for="person-presbytery">
                        <b-form-select v-model="person.presbytery" :options="presbyteryOptions" :readonly="mode === 'remove'"></b-form-select>
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Paróquia" label-for="person-congregation">
                        <b-form-select v-model="person.congregation" :options="congregationOptions" :readonly="mode === 'remove'"></b-form-select>
                    </b-form-group>
                </b-col>
            </b-row>
            <b-row>
                <b-col md="6" sm="12">
                    <b-form-group label="Telemóvel:" label-for="person-mobile">
                        <b-form-input id="person-mobile" type="text" v-model="person.mobile" :readonly="mode === 'remove'" placeholder="Informe o Telemóvel" />
                    </b-form-group>
                </b-col>
                <b-col md="6" sm="12">
                    <b-form-group label="Email:" label-for="person-email">
                        <b-form-input id="person-email" type="text" v-model="person.email" :readonly="mode === 'remove'" placeholder="Informe o Email" />
                    </b-form-group>
                </b-col>
            </b-row>

            <div>
                <hr>
                <b-button class="mr-2" @click="reset">
                    <i class="fa fa-times"></i>
                    Cancelar
                </b-button>
                <b-button variant="primary" v-if="mode === 'save'" @click="save">
                    <i class="fa fa-save"></i>
                    Gravar
                </b-button>
                <b-button variant="danger" v-if="mode === 'remove'" @click="remove">
                    <i class="fa fa-times"></i>
                    Remover
                </b-button>
            </div>
        </b-form>
        <div class="create-btn">
            <b-button router-tag="/"  class="mr-2" v-if="mode === 'create'" >
                <i class="fa fa-arrow-left"></i>
                Voltar
                <router-link to="/"/>
            </b-button>
            <b-button variant="primary" v-if="mode === 'create'" @click="createPerson()">
                <i class="fa fa-plus"></i>
                Adicionar
            </b-button>
        </div>
        <div v-if="mode==='create'">
            <hr>
            <b-table hover striped :items="persons" :fields="fields">
                <template slot="actions" slot-scope="data">
                    <b-button variant="warning" @click="loadPerson(data.item)" class="mr-2">
                        <i class="fa fa-pencil"></i>
                    </b-button>
                    <b-button variant="danger" @click="loadPerson(data.item, 'remove')">
                        <i class="fa fa-trash"></i>
                    </b-button>
                </template>
            </b-table>
            <b-pagination size="md" v-model="page" :total-rows="count" :per-page="limit" />
        </div>
    </div>
</template>

<script>
import PageTitle from '../template/PageTitle'
import { baseApiUrl, showError } from '@/global'
import axios from 'axios'

export default {
    name: 'Person',
    components: { PageTitle },
    data: function() {
        return {
            mode: 'create',
            count: 5,
            person: {},
            persons: [],
            fields:[
                { key: 'id' , label: 'Id', sortable: true },
                { key: 'surname' , label: 'Apelido', sortable: true },
                { key: 'name' , label: 'Nome', sortable: true },
                { key: 'birthdate' , label: 'D. Nasc.', sortable: true },
                // { key: 'gender' , label: 'Gênero'},
                { key: 'baptized' , label: 'Baptizado?', formatter: value => value ? 'Sim' : 'Não' },
                { key: 'confirmed' , label: 'Confirmado?', formatter: value => value ? 'Sim' : 'Não' },
                { key: 'society' , label: 'Sociedade'},
                // { key: 'mobile' , label: 'Telemóvel'},
                // { key: 'email' , label: 'Email', sortable: true },
                { key: 'actions', label: 'Acções' }
            ],
            societyOptions: [
                { value: null, text: 'Seleccione a Sociedade' },
                { value: 'SPJ', text: 'Sociedade Presbitériana de Jovens' },
                { value: 'SPA', text: 'Sociedade Presbitériana dos Activistas' },
                { value: 'SPH', text: 'Sociedade Presbitériana de Homens' },
                { value: 'SPMC', text: 'Sociedade Presbitériana de Mamanas de Caridade' }
            ],
            presbyteryOptions: [],
            congregationOptions:[]
        }
    },
    methods: {
        loadPersons() {
            const url = `${baseApiUrl}/persons`
            axios.get(url).then(res => {
                this.persons = res.data
            })
        },    
        save() {
            const method = this.person.id ? 'put' : 'post'
            const id = this.person.id ? `/${this.person.id}` : ''
            axios[method](`${baseApiUrl}/persons${id}`, this.person)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                }).catch(showError)
        },
        remove() {
            const id = this.person.id
            axios.delete(`${baseApiUrl}/persons/${id}`)
                .then(() => {
                    this.$toasted.global.defaultSuccess()
                    this.reset()
                }).catch(showError)
        },
        reset() {
            this.mode = 'create'
            this.person = {}
            this.loadPersons()
        },
        createPerson() {
            this.mode = 'save'
        },
        loadPerson(person, mode = 'save') {
            this.mode = mode
            this.person = { ...person }
        }
    },
    mounted() {
        this.loadPersons()
    }
}
</script>

<style>
    .create-btn {
        text-align: center;
    }
</style>