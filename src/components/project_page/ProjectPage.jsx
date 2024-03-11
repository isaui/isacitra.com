
import { HomepageNav } from "../nav/Nav";
import Footer from "../footer/Footer";
import { ProjectWithVideo } from "../project/Project";
import { CircleWithDivider } from "../divider/Divider";

export default function ProjectPage() {
    return <div className=" bg-slate-900">
        <div className=' min-h-screen flex justify-center items-center flex-col w-full'>
            <HomepageNav/>
         <div className='homepage-content  min-h-screen w-full flex flex-col my-auto items-center max-w-6xl'>
         <div className=" mt-20 -mb-8 w-full">
        <CircleWithDivider number={2}/>
        </div>
        <ProjectWithVideo name='Pantau' videoId='kNTI3uQzmxs' contributors={
            [{
                name: 'Naufal Ichsan',
                link: 'https://www.linkedin.com/in/naufal-ichsan-5423b722a/'
            },
                {
                    name:'Muhammad Nanda Pratama',
                    link:'https://www.linkedin.com/in/nanda-pratama-885338254/'
                },
                {
                    name:'Isa Citra Buana',
                    link:'https://www.linkedin.com/in/isacitra/'
                },
                
            ]
        } label='Mobile App' widgetTitle='Pantau Kasus' index={0} widgetContent='Penanganan kasus oleh pihak berwenang seringkali tergantung pada seberapa viral atau mendapatkan sorotan media sosial. Kasus yang tidak mendapatkan respons yang serius dari pihak kepolisian dapat terabaikan dan tidak mendapatkan penanganan yang adil. Hal tersebut mendorong kami untuk mengajukan ide pembuatan aplikasi Pantau. Pantau dirancang sebagai sebuah aplikasi yang dapat meningkatkan partisipasi masyarakat dalam kasus hukum. Melalui Pantau, masyarakat tidak perlu lagi bergantung pada viralitas di media sosial agar kasus yang mereka laporkan mendapatkan perhatian yang layak.
        ' />
        <div className=" mt-8 -mb-8 w-full">
        <CircleWithDivider number={1}/>
        </div>
<ProjectWithVideo name='Ally' videoId='50wgd8Kz8Qc' contributors={[{
            name: 'Abbil Haidar',
            link: 'https://www.linkedin.com/in/abbilville/'
        },
            {
                name:'Samuel Taniel Mulyadi',
                link:'https://www.linkedin.com/in/samuel-taniel-mulyadi/'
            },
            {
                name:'Isa Citra Buana',
                link:'https://www.linkedin.com/in/isacitra/'
            },
            
        ]} label='UI UX Design' widgetTitle='Ally: Platform Digital untuk Melawan Kejahatan Abusive' index={1} widgetContent='Di tengah kejahatan abusive yang semakin marak terjadi, keamanan dan keselamatan individu menjadi hal yang penting untuk diperhatikan. Namun, masyarakat sering mengabaikan keamanan dan kurang mempersiapkan diri untuk menghadapi bahaya seperti kekerasan seksual, kekerasan dalam rumah tangga, dan bahaya lainnya. Meskipun pemerintah telah menyediakan fasilitas yang memadai untuk mencegah dan mengatasi risiko kekerasan, informasi mengenai layanan tersebut tidak tersebar luas di kalangan masyarakat, sehingga spekulasi yang tidak akurat pun muncul dan menciptakan stereotip yang mendiskriminasi kesetaraan gender. Untuk mengatasi permasalahan ini, Ally hadir sebagai sebuah aplikasi yang dirancang untuk memberikan bantuan cepat dan efektif dalam menghadapi berbagai situasi berbahaya.
        ' />
        </div>
        <div className=" self-stretch">
        <Footer/>
        </div>
        
        </div>
    </div>
}