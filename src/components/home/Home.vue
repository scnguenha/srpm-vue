<template>
    <div class="home">
        <PageTitle icon="fa fa-home" main="Dashboard" sub="Página Inicial" />
        <div class="stats">
            <Stat title="Presbitérios" :value="stat.presbyteries" icon="fa fa-folder" color="#d54d50" />
            <Stat title = "Paróquias" :value="stat.congregations" icon="fa fa-file" color="#3bc480"/>
            <Stat title="Membros" :value="stat.members" icon="fa fa-users" color="#3282cd" />
        </div>
    </div>
</template>

<script>
import { baseApiUrl } from '@/global'
import axios from 'axios'
import PageTitle from '../template/PageTitle'
import Stat from './Stat'

export default {
    name: 'Home',
    components: { PageTitle, Stat },
    data: function() {
        return {
            stat: {}
        }
    },
    methods: {
        getStats() {
            const url = `${baseApiUrl}/stats`
            axios.get(url).then(res => {
                this.stat = res.data
            })
        }
    },
    mounted() {
        this.getStats()
    }
}
</script>

<style>
    .stats {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
    }
</style>