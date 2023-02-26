import { useRoute } from "@react-navigation/native";
import { ScrollView, Text, View, Alert } from "react-native";
import dayjs from 'dayjs';
import { BackButton } from "../components/BackButton";
import { ProgressBar } from "../components/ProgressBar";
import { CheckBox } from "../components/CheckBox";
import { useEffect, useState } from "react";
import { Loading } from "../components/Loading";
import { api } from "../lib/axios";
import {generateProgressPercentage} from '../utils/generate-progress-percentage'
import { HabitsEmpty } from "../components/HabitsEmpty";



interface Params {
    date: string;
}

interface DayInfoProps {
    completedHabits: string[]
    possibleHabits: {
        id: string;
        title: string;
    }[];
}

export function Habit() {

    const [loading, setLoading] = useState(true);
    const [dayInfo, setDayInfo] = useState<DayInfoProps | null>(null)
    const [completedHabits, setCompletedHabits] = useState<string[]>([])

    const route = useRoute();
    const { date } = route.params as Params

    const parseDate = dayjs(date);
    const dayOfWeek = parseDate.format('dddd');
    const dayAndMonth = parseDate.format('DD/MM');

    const habitsProgress = dayInfo?.possibleHabits.length 
    ? generateProgressPercentage(dayInfo.possibleHabits.length, completedHabits.length)
    : 0

    async function fetchHabit() {
        try {
            setLoading(true)
            const email = "henrique.heiden@gmail.com"
            const response = await api.get('/day', { params: { date, email } })
            setDayInfo(response.data);
            setCompletedHabits(response.data.completedHabits)

        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não foi possivel carregar as informações dos hábitos ')
        }
        finally {
            setLoading(false);
        }
    }

    // if (loading) {
    //     return (
    //         <Loading />
    //     )
    // }

    
    async function handleToglleHabit(habitId: string) {
        try {
            await api.patch(`/habits/${habitId}/toggle`);
            if (completedHabits.includes(habitId)) {
                setCompletedHabits(prevState => prevState.filter(habit => habit !== habitId));
            } else {
                setCompletedHabits(prevState => [...prevState, habitId]);
            }
        } catch (error) {
            console.log(error)
            Alert.alert('Ops', 'Não é possível atualizar o status do hábito.');
        }
    }

    useEffect(() => {
        fetchHabit()
    }, [])
    return (
        <View className="flex-1 bg-background px-8 pt-16">
            <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                    paddingBottom: 100
                }}>
                <BackButton />

                <Text className="mt-6 text-zinc-400 font-semibold text-base lowercase">
                    {dayOfWeek}
                </Text>

                <Text className="text-white font-extrabold text-3xl">
                    {dayAndMonth}
                </Text>
                <ProgressBar progress={habitsProgress} />
                <View className="mt-6">
                    {

                        dayInfo?.possibleHabits.length ?
                        dayInfo?.possibleHabits.map(habit => (
                            <><CheckBox
                                key={habit.id}
                                title={habit.title}
                                checked={completedHabits.includes(habit.id)}
                                onPress={() => handleToglleHabit(habit.id)} />
                                
                                {/* <Text className="text-white">possibleHabits = : {dayInfo.possibleHabits.length}</Text>
                                <Text className="text-white">completedHabits = : {completedHabits.length}</Text> */}
                                {/* <Text className="text-white">ID = : {habit.id}</Text>
                                <Text className="text-white">completedHabits = : {completedHabits.map((item) => item )}</Text> */}
                                
                                </>
                                
                        ))
                        : <HabitsEmpty />
                    }                    

                </View>
            </ScrollView>
        </View>
    )
}
