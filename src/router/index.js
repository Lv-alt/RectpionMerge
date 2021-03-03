import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import StudentLogin from '../components/Student/StudentLogin'
import TeacherLogin from '../components/Teacher/TeacherLogin'
import Main from '../components/Main'
import GenerateTest from '../components/Teacher/GenerateTest'
import ShowSituation from '../components/Teacher/ShowSituation'
import ShowSubjectSituation from '../components/Student/ShowSubjectSituation'
import ShowSuitangTest from '../components/Student/ShowSuitangTest'
import addSuitangTest from '../components/Teacher/addSuitangTest'
import addSubject from '../components/Teacher/addSubject'
import ShowSubject from '../components/Student/ShowSubject'
import test from '../components/Student/test'
import NewForumMain from '../components/forum/NewForumMain'
import myPage from '../components/forum/myPage'

Vue.use(Router)


export default new Router({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    }, {
      path: '/StudentLogin',
      name: 'StudentLogin',
      component: StudentLogin
    }, {
      path: '/test',
      name: test,
      component: test
    }, {
      path: '/TeacherLogin',
      name: 'TeacherLogin',
      component: TeacherLogin
    }, {
      path: '/Main',
      name: 'Main',
      component: Main,
      children:[
        {
          path: '/GenerateTest',
          name: 'GenerateTest',
          component: GenerateTest
        }, {
          path: '/ShowSituation',
          name: 'ShowSituation',
          component: ShowSituation
        }, {
          path: '/ShowSubjectSituation',
          name: 'ShowSubjectSituation',
          component: ShowSubjectSituation
        }, {
          path: '/ShowSuitangTest',
          name: ShowSuitangTest,
          component: ShowSuitangTest
        }, {
          path: '/addSuitangTest',
          name: addSuitangTest,
          component: addSuitangTest
        }, {
          path: '/addSubject',
          name: addSubject,
          component: addSubject
        }, {
          path: '/ShowSubject',
          name: ShowSubject,
          component: ShowSubject
        },{
          path:'/NewForumMain',
          name: NewForumMain,
          component:NewForumMain
        }, {
          path: '/myPage',
          name: myPage,
          component:myPage
        }
      ]
    }
  ]
})
