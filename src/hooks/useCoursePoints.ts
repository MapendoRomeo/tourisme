
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import axios from '@/api/axios';
import { useSchoolYear } from '@/hooks/useSchoolYear';

export interface CourseConfig {
  _id: string;
  name: string;
  totalPoints: number;
  hoursPerWeek: number;
}


export const useCoursePoints = () => {
  const [selectedClass, setSelectedClass] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const schoolYearId = useSchoolYear();
  const [formData, setFormData] = useState({
    name: '',
    totalPoints: 0,
    hoursPerWeek: 0,
  });

  const [classConfigs, setClassConfigs] = useState<CourseConfig[]>([]);



const getCurrentClassConfig = async (classId: string) => {
  if (!classId) return;
  
    try {
      const res = await axios.get(`/subjects/${classId}`);
      setClassConfigs(res.data);
    } catch (error) {
      console.error('Erreur lors du chargement des cours :', error);
    }
  };

  useEffect(() => {
    if (selectedClass) {
      getCurrentClassConfig(selectedClass);
    } else {
      setClassConfigs([]);
    }
  }, [selectedClass]);

  const handleAdd = async() => {
    if (!selectedClass || !formData.name || !formData.totalPoints || !formData.hoursPerWeek) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/subjects', {
        name: formData.name ,
        totalPoints: formData.totalPoints,
        hoursPerWeek: formData.hoursPerWeek,
        class: selectedClass, 
        schoolYear: schoolYearId,
      });

    setIsAdding(false);
    setFormData({ name: '', totalPoints: 0, hoursPerWeek: 0 });
    toast.success('Configuration ajoutée avec succès');
    getCurrentClassConfig(selectedClass);
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || 'Erreur lors de l’ajout du cours');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: CourseConfig) => {
    setFormData({
      name: course.name,
      totalPoints: course.totalPoints,
      hoursPerWeek: course.hoursPerWeek,
    });
    setEditingId(course._id);
  };

  const handleSave = async() => {
    if (!formData.name || !formData.totalPoints || !formData.hoursPerWeek) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    try {
      const res = await axios.put(`/subjects/${editingId}`, formData);
      // Actualiser la liste des cours après mise à jour
      getCurrentClassConfig(selectedClass);
    } catch (err) {
      console.error('Erreur lors de la mise à jour du cours :', err);
    }

    setEditingId(null);
    setFormData({ name: '', totalPoints: 0, hoursPerWeek: 0 });
    toast.success('Configuration modifiée avec succès');
  };

  const handleDelete = async (courseId: string) => {
    try {
        await axios.delete(`/subjects/${courseId}`);
        toast.success("Cours supprimé avec succès.");
        // Recharger les cours après suppression
        getCurrentClassConfig(selectedClass);
      } catch (error) {
        toast.error("Erreur lors de la suppression.");
        console.error(error);
      }
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ name: '', totalPoints: 0, hoursPerWeek: 0 });
  };

  return {
    selectedClass,
    setSelectedClass,
    isAdding,
    setIsAdding,
    editingId,
    formData,
    setFormData,
    classConfigs,
    handleAdd,
    handleEdit,
    handleSave,
    handleDelete,
    handleCancel,
  };
};
